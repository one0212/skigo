const shortid = require('shortid');
const db = require('../config/db');
const Constants = require('../utils/Constants');

const insert = (userId, userCart, receiver, mobile, address) => {
  const orders = {
    orderNo: shortid.generate(),
    userId,
    products: userCart,
    receiver,
    mobile,
    address,
    status: Constants.ORDER_STATUS.PROCESSING,
    orderTime: new Date().getTime(),
  };
  db.read().get('orders').push(orders).write();
};

export default {
  insert,
};
