const usersDAL = require('./usersDAL')

export function createUser(req, res) {
    const {email, password} = req.body
    if (usersDAL.emailExist(email)) {
        res.status(404).json({ message: "信箱已被註冊" })
        res.end()
    }
    const user = usersDAL.createUser(email, password)
    res.json(user)
}

export function doLogin(req, res) {
    const {email, password} = req.body
    let user = usersDAL.existBy(email, password)
    if (!user) {
        res.status(404).json({ message: "帳號密碼錯誤" })
        res.end()
    }
    res.json({ message: `${user.email} login succeed.` })
}