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
// router.get('/attraction-text', (req, res) => {
//   const sql = 'SELECT * FROM `AttractionsDataNew` INNER JOIN ASnowField ON ASnowField.ASFsid=
// AttractionsDataNew.ASnowFieldID';
//   db.query(sql, (error, results) => {
//     // 印出變數代稱是否有成功撈到(為字串)
//     // console.log(req.params.class_sid);
//     res.json(results);
//   });
// });


// 篩選
router.post('/attraction-text', urlencodedParser, (req, res) => {
  const a = req.body.select;// single
  const b = req.body.slectstate; // more
  let single = '';

  const fieldData = ['景點', '美食', '購物', '遊樂園'];
  const fieldB = b.slice(0, 4);

  const field = [];

  fieldB.forEach((v, i) => {
    if (v) {
      field.push(fieldData[i]);
    }
  });

  let where = ' WHERE 1 ';
  if (field.length) {
    where += ` AND ACateGory IN ('${field.join("','")}') `;
  }


  console.log(req.body);
  console.log(a);
  console.log(b);

  if (a == 1) {
    single = ' AND AttractionsDataNew.ASnowFieldID=1';
    console.log(single);
  } else if (a == 2) {
    single = ' AND AttractionsDataNew.ASnowFieldID=2';
    console.log(single);
  } else if (a == 3) {
    single = ' AND AttractionsDataNew.ASnowFieldID=3';
    console.log(single);
  } else {
    single = '';
    console.log('no date!!!');
  }

  const sql = `SELECT * FROM \`AttractionsDataNew\` INNER JOIN ASnowField ON ASnowField.ASFsid=AttractionsDataNew.ASnowFieldID${where}${single}`;
  console.log(sql);

  db.query(sql, (error, results) => {
    // 印出變數代稱是否有成功撈到(為字串)
    // console.log(req.params.class_sid);
    res.json(results);
  });
});

module.exports = router;
