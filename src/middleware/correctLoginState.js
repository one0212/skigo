const Constants = require('../utils/Constants');

const correctLoginState = (req, res, next) => {
  const logined = !!req.session && !!req.session.user;
  const clientSessionId = req.cookies[Constants.COOKIE.SESSION_ID];
  const clientRole = req.cookies[Constants.COOKIE.ROLE];
  const sessionRole = logined ? req.session.user.role : undefined;

  // 有登入，身份不一致就覆蓋身份
  if (logined && clientRole !== sessionRole) {
    res.cookie(Constants.COOKIE.ROLE, sessionRole);
  }
  // 未登入，身份不是遊客就改成遊客
  if (!logined && clientRole !== Constants.ROLE.VISITOR) {
    res.cookie(Constants.COOKIE.ROLE, Constants.ROLE.VISITOR);
  }
  // 未登入，有 session_id 就清掉 cookie
  if (!logined && clientSessionId) {
    res.clearCookie(Constants.COOKIE.SESSION_ID);
  }
  return next();
};

module.exports = correctLoginState;
