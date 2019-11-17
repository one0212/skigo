const nodemailer = require('nodemailer');
const fs = require('fs');
const log = require('../config/winston');
const usersDAL = require('./usersDAL');
const UserSession = require('./UserSession');
const Constants = require('../utils/Constants');

const mailContent = fs.readFileSync(`${__dirname}/active_user_mail.html`,
  'utf-8',
  (err, buffer) => {
    if (err) {
      throw err;
    }
    process(buffer);
  });

const mailSender = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 587,
  auth: {
    user: 'skigo.bot@gmail.com',
    pass: 'gcejtcggfvvkbirk', // 之後再改讀外部設定檔
  },
});

function responseError(res, code, msg) {
  res.status(code).json({ message: msg });
}

function saveLoginedSession(req, res, user) {
  req.session.regenerate((err) => {
    if (err) {
      log.error(err);
      responseError(res, 500, '登入失敗');
      return;
    }
    req.session.user = new UserSession(user.email, user.role, {});
    res.cookie(Constants.COOKIE.ROLE, user.role);
    res.sendStatus(200);
  });
}

export function createUser(req, res) {
  const { email, password, role } = req.body;
  if (usersDAL.emailExist(email)) {
    responseError(res, 400, '信箱已被註冊');
    return;
  }

  const user = usersDAL.createUser(email, password, role);
  if (!user) {
    responseError(res, 500, '系統錯誤');
    return;
  }
  mailSender.sendMail({
    from: 'no-reply@skigo.com',
    to: email,
    subject: '驗證您的 SKIGO 帳號',
    html: mailContent.replace(`${email}`, email).replace(`${user.activeCode}`, user.activeCode),
  }, (err, info) => {
    if (err) {
      log.error(`註冊信發送失敗. err=${JSON.stringify(err)}`);
    } else {
      log.info(`註冊信發送成功. info=${JSON.stringify(info)}`);
    }
  });
  saveLoginedSession(req, res, user);
}

export function doLogin(req, res) {
  const { email, password } = req.body;
  const user = usersDAL.findBy(email, password);
  if (!user) {
    responseError(res, 400, '帳號密碼錯誤');
    return;
  }
  saveLoginedSession(req, res, user);
}

export function activeUser(req, res) {
  const { email, activeCode } = req.body;
  if (!usersDAL.emailExist(email)) {
    responseError(res, 400, '啟用帳號失敗 - 帳號不存在');
    return;
  }
  try {
    usersDAL.activeUser(email, activeCode);
    res.sendStatus(200);
  } catch (err) {
    log.info(`啟用帳號失敗, err=${JSON.stringify(err)}`);
    responseError(res, 400, '啟用帳號失敗 - 連結已失效');
  }
}

export function logout(req, res) {
  log.info(JSON.stringify(req.session));
  const sid = req.cookies[Constants.COOKIE.SESSION_ID];
  req.session.destroy(sid, (err) => {
    if (err) {
      log.error(`Destroy session failed. err=${err}`);
    }

    res.clearCookie(Constants.COOKIE.SESSION_ID);
    res.cookie(Constants.COOKIE.ROLE, Constants.ROLE.VISITOR);
    res.sendStatus(200);
  });
}
