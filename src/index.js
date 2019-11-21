const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const figlet = require('figlet');
const jsonServer = require('json-server');
const fs = require('fs');

const jRouter = jsonServer.router('db.json');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const log = require('./config/winston');
const userApi = require('./users/router');
const setRole = require('./middleware/setRole');
const Constants = require('./utils/Constants');
const bluebird = require('bluebird');


const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('combined', { stream: log.stream }));
// 資料庫連線
const urlencodedParser = bodyParser.urlencoded({ extend: false });

const db = mysql.createConnection({
  host: '35.201.219.20',
  user: 'skier',
  password: 'ski1203',
  database: 'SKI',
});

db.connect();// 連線

bluebird.promisifyAll(db);

// ============= CORS + 白名單===================

const whitelist = ['http://localhost:3001', undefined, 'http://localhost:8080', 'http://localhost:3000'];
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    // console.log(`origin: ${origin}`);

    if (whitelist.indexOf(origin) >= 0) {
      callback(null, true);
    } else {
      callback(new Error('EEEEEEEEError'));
    }
  },
};

app.use(cors(corsOptions));


// ============= Session ===================
app.use(session({
  name: Constants.COOKIE.SESSION_ID,
  secret: 'momo', // 之後再移到外部 config
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 學 netflix 存一年
    httpOnly: true,
    // secure: true 需要搭配 https才能啟用
  },
}));

// ============== Banner ====================
const banner = figlet.textSync('SKIGO !!!', {
  font: 'ghost',
  horizontalLayout: 'full',
  verticalLayout: 'full',
});

// ============== reloadDB =================
const reloadDB = (req, res, next) => {
  const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  jRouter.db.setState(db);
  next();
};

// ============== Routes ====================
app.use(setRole);
app.use('/api/user', userApi);
app.use('/japi', reloadDB, jRouter);

// 教練資料庫一 coachlist用 篩選過濾相同的 coach-list
// 使用變數代稱設定路由

app.post('/coach-list', urlencodedParser, (req, res) => {
  console.log(req.body);
  let Sort = '';
  if (req.body.sort == true) {
    Sort = 'ORDER BY `class_price` DESC ';
    console.log(`從高到低${  Sort}`);
  } else if (req.body.sort == false) {
    Sort = 'ORDER BY `class_price` ASC ';
    console.log(`從低到高${  Sort}`);
  }else {
    console.log('no sort!')
    Sort =''
  }

  // output 過濾重複課程的陣列
  let output = [];
  const field_data = ['北海道', '青森縣', '山形縣', '新瀉縣'];
  const level_data = ['初級', '中級', '高級'];
  const board_data = ['單板', '雙板'];

  const field_b = req.body.name.slice(0, 4);
  const level_b = req.body.name.slice(4, 7);
  const board_b = req.body.name.slice(7, 9);
  const lang_b = req.body.name.slice(9);

  const field = [];
  field_b.forEach((v, i) => {
    if (v) {
      field.push(field_data[i]);
    }
  });

  const level = [];
  level_b.forEach((v, i) => {
    if (v) {
      level.push(level_data[i]);
    }
  });

  const board = [];
  board_b.forEach((v, i) => {
    if (v) {
      board.push(board_data[i]);
    }
  });

  // console.log({ field, level, board });

  const lang = [];

  let where = ' WHERE 1 ';
  if (field.length) {
    where += ` AND class_field IN ('${field.join("','")}') `;
  }

  if (level.length) {
    where += ` AND class_level IN ('${level.join("','")}') `;
  }

  if (board.length) {
    where += ` AND class_board IN ('${board.join("','")}') `;
  }
  let lang_val = 0;
  if (req.body[9]) lang_val += 1; // chinese
  if (req.body[10]) lang_val += 2;// eng
  if (req.body[11]) lang_val += 4;// jap

  switch (lang_val) {
    case 1:
      where += ' AND class_lang_cha=1 '; // c
      break;
    case 2:
      where += ' AND class_lang_eng=1 '; // e
      break;
    case 4:
      where += ' AND class_lang_jap=1 ';// j
      break;
    case 3:
      where += ' AND (class_lang_cha=1 OR class_lang_eng=1) ';// c+e
      break;
    case 5:
      where += ' AND (class_lang_cha=1 OR class_lang_jap=1) ';// c+j
      break;
    case 6:
      where += ' AND (class_lang_jap=1 OR class_lang_eng=1) ';// e+j
      break;
    case 7:
      where += ' AND (class_lang_cha=1  OR class_lang_jap=1 OR class_lang_eng=1) ';// c+e+j
      break;
  }

  // console.log(`SELECT * FROM coach ${where} `);
  db.query(`SELECT * FROM coach ${where} ${Sort}`, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);

    // 每一筆資料比對 class_sid 沒有重複的 class_sid 才放到el陣列中
    // 並用map重新return，存入output陣列

    // console.log(results);

    output = results.map((el) => {
      if (output.indexOf(el.class_sid) === -1) {
        output.push(el.class_sid);
        return el;
      }
    });
    console.log(output);

    res.json(output);
  });
});

// 教練資料庫二 coachclass用 全部資料表
app.get('/coach-class/:class_sid', (req, res) => {
  // '/coach-class/:class_sid?' 再補上
  // 取路由的變數 req.params.變數代稱 再補上
  const { class_sid } = req.params;


  // SQL篩選路由輸入的變數的資料
  const sql = `SELECT * FROM coach WHERE class_sid = '${class_sid}'`;

  console.log(req.params);

  // const sql = 'SELECT * FROM coach WHERE class_sid = \'c1\'';


  // const sql = `SELECT * FROM coach `;

  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json(results);
  });
});

// 教練資料庫三
app.get('/coach-book/:coach_sid?', (req, res) => {
  // '/coach-class/:class_sid?' 再補上
  // 取路由的變數 req.params.變數代稱 再補上
  const { coach_sid } = req.params;
  console.log(req.params);
  console.log(typeof (coach_sid));


  // SQL篩選路由輸入的變數的資料
  const sql = `SELECT * FROM coach WHERE coach_sid = '${coach_sid}'`;


  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json(results);
  });
});

// 教練資料庫四 - 隨機排序

app.post('/coach-random', urlencodedParser, (req, res) => {
  console.log(req.body);

  // output 過濾重複課程的陣列
  let output = [];
  
  // console.log(`SELECT * FROM coach ${where} `);
  db.query(`SELECT * FROM coach`, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);

    // 每一筆資料比對 class_sid 沒有重複的 class_sid 才放到el陣列中
    // 並用map重新return，存入output陣列

    // console.log(results);

    output = results.map((el) => {
      if (output.indexOf(el.class_sid) === -1) {
        output.push(el.class_sid);
        return el;
      }
    });
    output = output.filter(v=>{
      return v ? true : false;
    });

    output.sort(function(){
      return Math.random()-.5;
    });
    console.log(output);

    res.json(output.slice(0,3));
  });
});

app.listen(port, () => log.info(`Server started, listening on port ${port} \n ${banner}`));
