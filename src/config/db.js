const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(
  'db.json',
  {
    defaultValue: {
      users: [],
      orders: [],
      hotels: [],
      areas: [],
      attractions: [],
      coach: [],
      products: [],
    },
  },
);
const db = low(adapter);
module.exports = db;
