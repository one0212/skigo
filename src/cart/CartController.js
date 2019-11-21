const Constants = require('../utils/Constants');
const log = require('../config/winston');
const CartService = require('./CartService');

function responseError(res, code = 400, msg = 'Bad request') {
  res.status(code).json({ message: msg });
}

function verifyBeforeGetCart(req, res) {
  if (!req.session || !req.session.user) {
    log.error('使用者未登入，無法訪問購物車商品');
    responseError(res, 401, '請先登入');
    return false;
  }
  return true;
}

function verifyBeforeAddItem(req, res) {
  if (!req.session || !req.session.user) {
    log.error('使用者未登入，無法加入商品');
    responseError(res, 401, '請先登入');
    return false;
  }
  const { prodId, prodType, qty } = req.body;
  if (!prodId) {
    log.error(`不正確的商品id. prodId=${prodId}`);
    responseError(res, `不正確的商品id. prodId=${prodId}`);
    return false;
  }
  if (!prodType || !Object.values(Constants.PROD_TABLE).indexOf(prodType) === -1) {
    log.error(`不正確的商品類型. prodType=${prodType}`);
    responseError(res, `不正確的商品數量. prodType=${prodType}`);
    return false;
  }
  if (!qty || qty < 1) {
    log.error(`不正確的商品數量. qty=${qty}`);
    responseError(res, `不正確的商品數量. qty=${qty}`);
    return false;
  }
  return true;
}

export function getCart(req, res) {
  log.info(`GetCartItems api - sessionId=${req.cookies[Constants.COOKIE.SESSION_ID]}`);
  if (!verifyBeforeGetCart(req, res)) {
    return;
  }
  CartService.getCart(req, res);
}

export function addItem(req, res) {
  log.info(`AddCartItem api - body=${JSON.stringify(req.body)}`);
  if (!verifyBeforeAddItem(req, res)) {
    return;
  }
  CartService.addItem(req, res);
}
