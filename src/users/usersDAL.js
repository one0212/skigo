const users = [];

export function createUser(email, password) {
  const user = { email, password, activeEmail: false };
  users.push(user);
  return user;
}

export function emailExist(email) {
  return users.find((u) => u.email === email);
}

export function findBy(email, password) {
  return users.find((u) => u.email === email && u.password === password);
}
