const shortid = require('shortid');
const db = require('../config/db');
const Constants = require('../utils/Constants');

const insert = (userId, products, orderAmt, receiver, mobile, address) => {
  const orders = {
    orderNo: shortid.generate(),
    userId,
    products,
    orderAmt,
    receiver,
    mobile,
    address,
    status: Constants.ORDER_STATUS.PROCESSING,
    orderTime: new Date().getTime(),
  };
  db.read().get('orders').push(orders).write();
  return orders.orderNo;
};

function findByUserId(userId) {
  return db.read().get('orders').filter({ userId }).value();
}

export default {
  insert,
  findByUserId,
};
