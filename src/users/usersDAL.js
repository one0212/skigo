
const users = [];

export function createUser(email, password) {
    users.push({ email: email, password: password })
    return users.find(u => u.email === email);
}

export function emailExist(email) {
    return users.find(u => u.email === email);
}

export function existBy(email, password) {
    return users.find(u => u.email === email && u.password === password);
}