const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bluebird = require('bluebird');
const log = require('../config/winston');


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

router.post('/coach-list', urlencodedParser, (req, res) => {
  console.log(req.body);
  let Sort = '';
  if (req.body.sort === true) {
    Sort = 'ORDER BY `class_price` DESC ';
    console.log(`從高到低${Sort}`);
  } else if (req.body.sort === false) {
    Sort = 'ORDER BY `class_price` ASC ';
    console.log(`從低到高${Sort}`);
  } else {
    console.log('no sort!');
    Sort = '';
  }

  // output 過濾重複課程的陣列
  let output = [];
  const fieldData = ['北海道', '青森縣', '山形縣', '新瀉縣'];
  const levelData = ['初級', '中級', '高級'];
  const boardData = ['單板', '雙板'];

  const fieldB = req.body.name.slice(0, 4);
  const levelB = req.body.name.slice(4, 7);
  const boardB = req.body.name.slice(7, 9);
  // const langB = req.body.name.slice(9);

  const field = [];
  fieldB.forEach((v, i) => {
    if (v) {
      field.push(fieldData[i]);
    }
  });

  const level = [];
  levelB.forEach((v, i) => {
    if (v) {
      level.push(levelData[i]);
    }
  });

  const board = [];
  boardB.forEach((v, i) => {
    if (v) {
      board.push(boardData[i]);
    }
  });

  // console.log({ field, level, board });

  // const lang = [];

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
  let langVal = 0;
  if (req.body.name[9]) langVal += 1; // chinese
  if (req.body.name[10]) langVal += 2;// eng
  if (req.body.name[11]) langVal += 4;// jap

  switch (langVal) {
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
    default:
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
      return undefined;
    });
    console.log(output);

    res.json(output);
  });
});

// 教練資料庫二 coachclass用 全部資料表
router.get('/coach-class/:classSid', (req, res) => {
  // '/coach-class/:class_sid?' 再補上
  // 取路由的變數 req.params.變數代稱 再補上
  const { classSid } = req.params;

  // SQL篩選路由輸入的變數的資料
  const sql = `SELECT * FROM coach WHERE class_sid = '${classSid}'`;

  log.info(req.params);

  // const sql = 'SELECT * FROM coach WHERE class_sid = \'c1\'';

  // const sql = `SELECT * FROM coach `;

  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json(results);
  });
});

// 教練資料庫三
router.get('/coach-book/:coachSid?', (req, res) => {
  // '/coach-class/:class_sid?' 再補上
  // 取路由的變數 req.params.變數代稱 再補上
  const { coachSid } = req.params;
  log.info(req.params);
  log.info(typeof (coachSid));

  // SQL篩選路由輸入的變數的資料
  const sql = `SELECT * FROM coach WHERE coach_sid = '${coachSid}'`;

  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json(results);
  });
});

// 教練資料庫四 - 隨機排序

router.post('/coach-random', urlencodedParser, (req, res) => {
  console.log(req.body);

  // output 過濾重複課程的陣列
  let output = [];

  // console.log(`SELECT * FROM coach ${where} `);
  db.query('SELECT * FROM coach', (error, results) => {
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
      return undefined;
    });
    output = output.filter((v) => !!v);

    output.sort(() => Math.random() - 0.5);
    console.log(output);

    res.json(output.slice(0, 3));
  });
});

module.exports = router;
