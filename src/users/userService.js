const nodemailer = require('nodemailer');
const fs = require('fs');
const log = require('../config/winston');
const usersDAL = require('./usersDAL');

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

function saveSession(req, res, user) {
  req.session.regenerate((err) => {
    if (err) {
      log.error(err);
      responseError(res, 500, '登入失敗');
      return;
    }
    req.session.loginUser = user.email;
    res.sendStatus(200);
  });
}

export function createUser(req, res) {
  const { email, password } = req.body;
  if (usersDAL.emailExist(email)) {
    responseError(res, 400, '信箱已被註冊');
    return;
  }

  const user = usersDAL.createUser(email, password);
  if (!user) {
    responseError(res, 500, '系統錯誤');
    return;
  }
  mailSender.sendMail({
    from: 'no-reply@skigo.com',
    to: email,
    subject: '驗證您的 SKIGO 帳號',
    html: mailContent.replace('{email}', email).replace('{activeCode}', user.activeCode),
  }, (err, info) => {
    if (err) {
      log.error(`註冊信發送失敗. err=${JSON.stringify(err)}`);
    } else {
      log.info(`註冊信發送成功. info=${JSON.stringify(info)}`);
    }
  });
  saveSession(req, res, user);
}

export function doLogin(req, res) {
  const { email, password } = req.body;
  const user = usersDAL.findBy(email, password);
  if (!user) {
    responseError(res, 400, '帳號密碼錯誤');
    return;
  }
  saveSession(req, res, user);
}

export function isLogin(req, res) {
  if (req.session && req.session.loginUser) {
    log.info('已登入');
    res.sendStatus(200);
  } else {
    log.info('未登入');
    res.sendStatus(401);
  }
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
