const nodemailer = require('nodemailer');
const log = require('../config/winston');
const usersDAL = require('./usersDAL');

const mailSender = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 587,
  auth: {
    user: 'skigo.bot@gmail.com',
    pass: 'gcejtcggfvvkbirk', // 之後再改讀外部設定檔
  },
});

function responseError(req, res, code, msg) {
  res.status(code).json({ message: msg }).send();
}

function saveSession(req, res, user) {
  req.session.regenerate((err) => {
    if (err) {
      log.error(err);
      responseError(req, res, 500, '登入失敗');
    }

    req.session.loginUser = user.email;
    res.sendStatus(200);
  });
}

export async function createUser(req, res) {
  const { email, password } = req.body;
  if (usersDAL.emailExist(email)) {
    responseError(req, res, 400, '信箱已被註冊');
  }

  const user = usersDAL.createUser(email, password);
  if (!user) {
    responseError(req, res, 500, '系統錯誤');
  }
  mailSender.sendMail({
    from: 'no-reply@skigo.com',
    to: email,
    subject: '驗證您的 Skigo 帳號',
    html: `<h1>驗證您的 Skigo 帳號</h1>
          <form>
            <button>點此按鈕啟用帳號</button>
          </form>`,
  }, (err, info) => {
    if (err) {
      log.error(err);
    } else {
      log.info(info);
    }
  });
  saveSession(req, res, user);
}

export function doLogin(req, res) {
  const { email, password } = req.body;
  const user = usersDAL.findBy(email, password);
  if (!user) {
    responseError(req, res, 400, '帳號密碼錯誤');
  } else {
    saveSession(req, res, user);
  }
}

export function isLogin(req, res) {
  if (req.session && req.session.loginUser) {
    log.info('已登入');
    res.sendStatus(200);
  } else {
    log.info('未登入');
    res.sendStatus(403);
  }
}
