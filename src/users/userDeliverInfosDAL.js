const shortid = require('shortid');
const db = require('../config/db');
// const log = require('../config/winston');


export function insert(userId, receiver, mobile, address) {
  const deliveryInfo = {
    id: shortid.generate(),
    userId,
    receiver,
    mobile,
    address,
  };
  db.read().get('userDeliveryInfos').push(deliveryInfo).write();
}

export function get(userId) {
  // log.info(db.read().get('userDeliveryInfos').find({ userId }).value());
  return JSON.stringify(db.read().get('userDeliveryInfos').find({ userId }).value());

}
