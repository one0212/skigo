const usersService = require('./userService');

function response400(res, msg = 'Bad request') {
  res.status(400).json({ message: msg });
  res.end();
}

function verifySignup(req, res) {
  const { body } = req;
  if (!body.email) {
    response400(res, '信箱未填寫');
  } else if (!body.password) {
    response400(res, '密碼未填寫');
  }
}

function verifyLogin(req, res) {
  const { body } = req.body;
  if (!body.email || !body.password) {
    response400(res, '帳號未填寫');
  } else if (!body.password) {
    response400(res, '密碼未填寫');
  }
}

export function signup(req, res) {
  console.log(`Sign-up api - email=${req.body.email} password=${req.body.password}`);
  verifySignup(req, res);
  return usersService.createUser(req, res);
}

export function login(req, res) {
  console.log(`Login api - email=${req.body.email} password=${req.body.password}`);
  verifyLogin(req, res);
  usersService.doLogin(req, res);
}
