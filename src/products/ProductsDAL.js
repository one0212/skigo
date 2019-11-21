// const log = require('../config/winston');
const db = require('../config/db');

export function findByTableAndId(table, id) {
  return db.read().get(table).find({ id }).value();
}

export function xxx() {
  // TODO
}
