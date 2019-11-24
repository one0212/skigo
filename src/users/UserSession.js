export default class UserSession {
  constructor(id, email, role, cart = {}) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.cart = cart;
  }
}

module.exports = UserSession;
