const shortid = require('shortid');
const log = require('../config/winston');
const db = require('../config/db');

const expiredTime = 1000 * 60 * 60; // 啟動碼一小時後過期

export function createUser(email, password, role) {
  const user = {
    id: shortid.generate(),
    email,
    password,
    role,
    avatar: '/images/avatar/default.png',
    activeCode: `${shortid.generate()}.${Date.now() + expiredTime}`,
    isActive: false,
  };
  db.read().get('users').push(user).write();
  return user;
}

export function emailExist(email) {
  return db.read().get('users').find({ email }).value();
}

export function findBy(email, password) {
  return db.read().get('users').find({ email, password }).value();
}

export function activeUser(email, requestCode) {
  const { activeCode } = db.read().get('users').find({ email }).value();
  if (activeCode === requestCode && Date.now() <= requestCode.split('.')[1]) {
    db.read()
      .get('users')
      .find({ email })
      .assign({ isActive: true })
      .write();
    log.info(`啟動碼驗證成功 - email=${email}`);
  } else {
    throw Error(`啟用連結已過期 - email=${email}`);
  }
}
