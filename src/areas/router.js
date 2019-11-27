const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bluebird = require('bluebird');
// const log = require('../config/winston');

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

// 票券資料庫一 ticketlist用 篩選過濾相同的 ticket-list
// 使用變數代稱設定路由

router.post('/ticket-list', urlencodedParser, (req, res) => {
  // console.log(req.body);
  let Sort = '';
  if (req.body.sort === true) {
    Sort = 'ORDER BY `ticket_price` DESC ';
    // console.log(`從高到低${Sort}`);
  } else if (req.body.sort === false) {
    Sort = 'ORDER BY `ticket_price` ASC ';
    // console.log(`從低到高${Sort}`);
  } else {
    // console.log('no sort!');
    Sort = '';
  }

  // output 過濾重複課程的陣列
  let output = [];
  const addrData = ['北海道', '青森縣', '山形縣', '新瀉縣'];
  const typeData = ['纜車券', '租借券', '超值套票'];
  const ageData = ['成人', '兒童', '敬老'];
  const dayData = ['一日', '二日', '三日'];

  const addrB = req.body.name.slice(0, 4);
  const typeB = req.body.name.slice(4, 7);
  const ageB = req.body.name.slice(7, 10);
  const dayB = req.body.name.slice(10, 13);

  const addr = [];
  addrB.forEach((v, i) => {
    if (v) {
      addr.push(addrData[i]);
    }
  });

  const type = [];
  typeB.forEach((v, i) => {
    if (v) {
      type.push(typeData[i]);
    }
  });

  const age = [];
  ageB.forEach((v, i) => {
    if (v) {
      age.push(ageData[i]);
    }
  });

  const day = [];
  dayB.forEach((v, i) => {
    if (v) {
      day.push(dayData[i]);
    }
  });

  // console.log({ addr, type, age, day });

  let where = ' WHERE 1 ';
  if (addr.length) {
    where += ` AND area_addr IN ('${addr.join("','")}') `;
  }

  if (type.length) {
    where += ` AND ticket_type IN ('${type.join("','")}') `;
  }
  if (age.length) {
    where += ` AND ticket_age IN ('${age.join("','")}') `;
  }

  if (day.length) {
    where += ` AND ticket_use_day IN ('${day.join("','")}') `;
  }
  console.log(where);
  // console.log(`SELECT * FROM ticket ${where} `);
  db.query(`SELECT * FROM ticket ${where} ${Sort}`, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    //   console.log(req.params.ticket_sid);

    // 每一筆資料比對 area_sid 沒有重複的 area_sid 才放到el陣列中
    // 並用map重新return，存入output陣列

    // console.log(results);
    console.log(results);
    output = results.map((el) => {
      if (output.indexOf(el.ticket_sid) === -1) {
        output.push(el.ticket_sid);
        return el;
      }
      return undefined;
    });
    // console.log(output);
    res.json(output);
  });
});

// 票券資料庫二 ticketarea用 全部資料表
router.get('/ticket-area/:areaSid?', (req, res) => {
  // '/ticket-area/:area_sid?' 再補上
  // 取路由的變數 req.params.變數代稱 再補上
  const { areaSid } = req.params;
  // console.log(req.params)

  // SQL篩選路由輸入的變數的資料
  const sql = `SELECT * FROM ticket WHERE area_sid = '${areaSid}'`;
  // const sql = 'SELECT * FROM ticket';

  console.log(req.params);

  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    console.log(results);
    res.json(results);
  });
});

// 票券資料庫三
router.get('/ticket-page/:ticketSid?', (req, res) => {
  const { ticketSid } = req.params;
  console.log(req.params);
  console.log(typeof (ticketSid));


  // SQL篩選路由輸入的變數的資料
  const sql = `SELECT * FROM ticket WHERE ticket_sid = '${ticketSid}'`;


  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.ticket_sid);
    res.json(results);
  });
});


module.exports = router;
