export default class UserSession {
  constructor(id, email, role, avatar, cart = {}) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.avatar = avatar;
    this.cart = cart;
  }
}

module.exports = UserSession;
