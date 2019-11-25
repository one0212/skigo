const Constants = require('../utils/Constants');
const log = require('../config/winston');
const usersService = require('./userService');

function responseError(res, msg = 'Bad request') {
  res.status(400).json({ message: msg });
}

function verifySignup(req, res) {
  const { email, password, role } = req.body;
  if (!email) {
    responseError(res, '信箱未填寫');
    return false;
  }
  if (!password) {
    responseError(res, '密碼未填寫');
    return false;
  }
  if (!role) {
    log.error('缺少重要參數 role');
    responseError(res, '系統異常');
    return false;
  }
  if (Object.values(Constants.ROLE).indexOf(role) === -1) {
    log.error(`請求參數格式不正確 role=${role}`);
    responseError(res, '系統異常');
    return false;
  }
  return true;
}

function verifyLogin(req, res) {
  const { email, password } = req.body;
  if (!email) {
    responseError(res, '帳號未填寫');
    return false;
  }
  if (!password) {
    responseError(res, '密碼未填寫');
    return false;
  }
  return true;
}

function verifyActiveUser(req, res) {
  const { email, activeCode } = req.body;
  if (!email) {
    responseError(res, '缺少參數: email');
    return false;
  }
  if (!activeCode) {
    responseError(res, '缺少參數: activeCode');
    return false;
  }
  return true;
}

function verifyAddDeliveryInfo(req, res) {
  const { receiver, mobile, address } = req.body;
  if (!receiver) {
    responseError(res, '缺少參數: receiver');
    return false;
  }
  if (!mobile) {
    responseError(res, '缺少參數: mobile');
    return false;
  }
  if (!address) {
    responseError(res, '缺少參數: address');
    return false;
  }
  return true;
}

export function signup(req, res) {
  log.info(`Sign-up api - body=${JSON.stringify(req.body)}`);
  if (!verifySignup(req, res)) {
    return;
  }
  usersService.createUser(req, res);
}

export function login(req, res) {
  log.info(`Login api - body=${JSON.stringify(req.body)}`);
  if (!verifyLogin(req, res)) {
    return;
  }
  usersService.doLogin(req, res);
}

export function activeUser(req, res) {
  log.info(`ActiveUser api - body=${JSON.stringify(req.body)}`);
  if (!verifyActiveUser(req, res)) {
    return;
  }
  usersService.activeUser(req, res);
}

export function logout(req, res) {
  log.info(`Logout api - user=${JSON.stringify(req.session.user)}`);
  usersService.logout(req, res);
}

export function addDeliveryInfo(req, res) {
  log.info(`AddDeliveryInfo api - body=${JSON.stringify(req.body)}`);
  if (!verifyAddDeliveryInfo(req, res)) {
    return;
  }
  usersService.addDeliveryInfo(req, res);
}


export function getDeliveryInfoList(req, res) {
  usersService.getDeliveryInfos(req, res);
}
