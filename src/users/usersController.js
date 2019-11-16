const log = require('../config/winston');
const usersService = require('./userService');

function responseError(res, msg = 'Bad request') {
  res.status(400).json({ message: msg });
}

function verifySignup(req, res) {
  const { email, password, role } = req.body;
  if (!email) {
    responseError(res, '信箱未填寫');
  } else if (!password) {
    responseError(res, '密碼未填寫');
  } else if (!role) {
    log.error('缺少重要參數 role');
    responseError(res, '系統異常');
  } else if (!/^(VISITOR|SKIGO|FB|G\+){1}$/.test(role)) {
    log.error(`請求參數格式不正確 role=${role}`);
    responseError(res, '系統異常');
  }
}

function verifyLogin(req, res) {
  const { email, password } = req.body;
  if (!email) {
    responseError(res, '帳號未填寫');
  } else if (!password) {
    responseError(res, '密碼未填寫');
  }
}

function verifyActiveUser(req, res) {
  const { email, activeCode } = req.body;
  if (!email) {
    responseError(res, '缺少參數: email');
  } else if (!activeCode) {
    responseError(res, '缺少參數: activeCode');
  }
}

export function signup(req, res) {
  log.info(`Sign-up api - body=${JSON.stringify(req.body)}`);
  verifySignup(req, res);
  usersService.createUser(req, res);
}

export function login(req, res) {
  log.info(`Login api - body=${JSON.stringify(req.body)}`);
  verifyLogin(req, res);
  usersService.doLogin(req, res);
}

export function isLogin(req, res) {
  usersService.isLogin(req, res);
}

export function activeUser(req, res) {
  log.info(`ActiveUser api - body=${JSON.stringify(req.body)}`);
  verifyActiveUser(req, res);
  usersService.activeUser(req, res);
}
