import ordersDAL from './ordersDAL';

const log = require('../config/winston');

function responseError(res, code, msg) {
  res.status(code).json({ message: msg });
}

const createOrder = (req, res) => {
  if (!req.session || !req.session.user) {
    log.error('尚未登入');
    responseError(res, 401, '尚未登入');
    return;
  }
  res.sendStatus(200);
  const { receiver, mobile, address } = req.body;
  ordersDAL.insert(req.session.user.id, req.session.user.cart, receiver, mobile, address);
};

export default {
  createOrder,
};
