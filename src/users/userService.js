const usersDAL = require('./usersDAL');


function responseError(req, res, code = 500, msg) {
  res.status(code).json({ message: msg });
  res.end();
}

function saveSession(req, res, user) {
  req.session.regenerate((err) => {
    if (err) {
      console.log(err);
      responseError(req, res, 500, '登入失敗');
    }

    req.session.loginUser = user.email;
    res.status(200).send();
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
  saveSession(req, res, user);
}

export function doLogin(req, res) {
  const { email, password } = req.body;
  const user = usersDAL.findBy(email, password);
  if (!user) {
    responseError(req, res, 400, '帳號密碼錯誤');
  }
  saveSession(req, res, user);
}
