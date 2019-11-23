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


// 資料表一:顯示 Attraction
router.get('/attraction', (req, res) => {
  const sql = 'SELECT * FROM AttractionsDay JOIN AttractionsDataNew ON AttractionsDay.sid = AttractionsDataNew.sid ';
  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json(results);
  });
});

// 資料表二:新增 (新增行程 + 第幾天)
router.post('/attractionAdd', urlencodedParser, (req, res) => {
  // 所需接收資料如下 : sid 為需增加的 AttractionsDataNew 內sid
  // {"sid":4,"day":2}

  console.log(req.body.sid);

  const sql = `INSERT INTO AttractionsDay (Attraction_sid , day) VALUES (${req.body.sid},${req.body.day} )`;
  console.log(sql);
  db.query(sql, () => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json('okok!');
  });
});

// 資料表三: 刪除
router.post('/attractionDel', urlencodedParser, (req, res) => {
  // 所需接收資料如下 : sid 為 AttractionsDay 要刪除資料的 sid
  // {"sid":4}

  console.log(req.body.sid);

  const sql = `DELETE FROM AttractionsDay WHERE \`sid\` = ${req.body.sid}`;
  console.log(sql);
  db.query(sql, () => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json('okok!');
  });
});

// 資料表四: 修改 (修改停留時間)
router.post('/attractionUpdate', urlencodedParser, (req, res) => {
  // 所需接收資料如下 : sid 要修改的流水號 stay 停留時間
  // {"sid":4 , "stay" :20}

  console.log(req.body.sid);
  console.log(req.body.stay);

  const sql = `UPDATE AttractionsDay SET stay_time = ${req.body.stay} WHERE sid =${req.body.sid}`;
  console.log(sql);
  db.query(sql, () => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json('okok!');
  });
});


module.exports = router;
