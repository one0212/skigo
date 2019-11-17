const Constants = require('../utils/Constants');

const setRole = (req, res, next) => {
  if (req.session && req.session.user) {
    res.cookie(Constants.COOKIE.ROLE, req.session.user.role);
  } else {
    res.clearCookie(Constants.COOKIE.SESSION_ID);
    res.cookie(Constants.COOKIE.ROLE, Constants.ROLE.VISITOR);
  }
  return next();
};

module.exports = setRole;
