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
  const { receiver, mobile, address } = req.body;
  const { id, cart } = req.session.user;
  const orderNo = ordersDAL.insert(id, Object.values(cart.items),
    cart.totalAmt,
    receiver,
    mobile,
    address);
  res.status(200).json({ orderNo });
};

const getUserOrder = (req, res) => {
  if (!req.session || !req.session.user) {
    log.error('尚未登入');
    responseError(res, 401, '尚未登入');
    return;
  }
  const orderData = ordersDAL.findByUserId(req.session.user.id);
  res.status(200).json(orderData);
};

export default {
  createOrder,
  getUserOrder,
};
