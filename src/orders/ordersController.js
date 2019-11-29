import ordersService from './ordersService';

const log = require('../config/winston');

// function responseError(res, msg = 'Bad request') {
//   res.status(400).json({ message: msg });
// }

// function verifyCreateOrder(req, res) {
//   const { receiver, mobile, address } = req.body;
//   if (!receiver) {
//     responseError(res, '收件人姓名未填寫');
//     return false;
//   }
//   if (!mobile) {
//     responseError(res, '收件人電話未填寫');
//     return false;
//   }
//   if (!address) {
//     responseError(res, '收件人地址未填寫');
//     return false;
//   }
//   return true;
// }

const createOrder = (req, res) => {
  log.info(`CreateOrder api - body=${JSON.stringify(req.body)}`);
  // if (!verifyCreateOrder(req, res)) {
  //   return;
  // }
  ordersService.createOrder(req, res);
};

const getUserOrder = (req, res) => {
  ordersService.getUserOrder(req, res);
};

export default {
  createOrder,
  getUserOrder,
};
