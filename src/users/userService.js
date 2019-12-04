const nodemailer = require('nodemailer');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const shortid = require('shortid');
const log = require('../config/winston');
const usersDAL = require('./usersDAL');
const userDeliverInfosDAL = require('./userDeliverInfosDAL');
const UserSession = require('./UserSession');
const Constants = require('../utils/Constants');
const Cart = require('../cart/Cart');

const CLIENT_ID = '71115162347-h4vb50788t99f79o1pata6n1u164m3ms.apps.googleusercontent.com';
const gClient = new OAuth2Client(CLIENT_ID);

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

function saveLoggedInSession(req, res, user) {
  console.log(req.session);
  req.session.regenerate((err) => {
    if (err) {
      log.error(err);
      responseError(res, 500, '登入失敗');
      return;
    }
    req.session.user = new UserSession(user.id, user.email, user.role, user.avatar, new Cart());
    res.cookie(Constants.COOKIE.ROLE, user.role);
    res.status(200).json({ avatar: user.avatar });
  });
}

async function verifyGoogleToken(token) {
  const ticket = await gClient.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  return ticket.payload;
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
    html: mailContent.replace('{email}', email).replace('{activeCode}', user.activeCode),
  }, (err, info) => {
    if (err) {
      log.error(`註冊信發送失敗. err=${JSON.stringify(err)}`);
    } else {
      log.info(`註冊信發送成功. info=${JSON.stringify(info)}`);
    }
  });
  saveLoggedInSession(req, res, user);
}

export function doLogin(req, res) {
  const { email, password } = req.body;
  const user = usersDAL.findBy(email, password);
  if (!user) {
    responseError(res, 400, '帳號密碼錯誤');
    return;
  }
  saveLoggedInSession(req, res, user);
}

export function doGLogin(req, res) {
  const { token } = req.body;
  verifyGoogleToken(token)
    .then((userInfo) => {
      saveLoggedInSession(req, res,
        {
          id: shortid.generate(),
          email: userInfo.email,
          avatar: userInfo.picture,
          role: Constants.ROLE.GOOGLE,
        });
    })
    .catch((err) => {
      log.error(err);
      responseError(res, 500, 'google login token 驗證失敗');
    });
}

export function doFbLogin(req, res) {
  saveLoggedInSession(req, res,
    {
      id: shortid.generate(),
      role: Constants.ROLE.FB,
    });
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
  req.session.destroy((err) => {
    if (err) {
      log.error(`Destroy session failed. err=${err}`);
    }
    res.clearCookie(Constants.COOKIE.SESSION_ID);
    res.cookie(Constants.COOKIE.ROLE, Constants.ROLE.VISITOR);
    res.sendStatus(200);
  });
}

export function addDeliveryInfo(req, res) {
  if (!req.session && !req.session.user) {
    log.error('尚未登入');
    responseError(res, 401, '尚未登入');
    res.sendStatus(401);
    return;
  }
  res.sendStatus(200);
  const { receiver, mobile, address } = req.body;
  userDeliverInfosDAL.insert(req.session.user.id, receiver, mobile, address);
}

export function getDeliveryInfos(req, res) {
  if (!req.session || !req.session.user) {
    log.error('尚未登入');
    responseError(res, 401, '尚未登入');
    return;
  }
  const infos = userDeliverInfosDAL.get(req.session.user.id);
  res.status(200).json(infos);
}
