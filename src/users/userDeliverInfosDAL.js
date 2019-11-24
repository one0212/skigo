const shortid = require('shortid');
const db = require('../config/db');

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

export function get() {
  console.log('test');
}
