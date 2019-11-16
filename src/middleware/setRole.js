
const setRole = (req, res, next) => {
  let role = 'VISITOR';
  if (req.session && req.session.user) {
    role = req.session.user.role;
  }

  res.cookie('role', role);
  return next();
};

module.exports = setRole;
