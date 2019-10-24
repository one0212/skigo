const express = require('express');
const router = express.Router();

const users = [];

router.post("/signup", (req, res) => {
    console.log(`Sign-up api - email=${req.body.email} password=${req.body.password}`);
    const body = req.body;
    if (!body.email || !body.password) {
        res.status(400).send("Invalid request parameter.");
        res.end();
    }

    users.push({ email: body.email, password: body.password });
    res.send(JSON.stringify(users));
});

router.post("/login", (req, res) => {
    console.log(`Login api - email=${req.body.email} password=${req.body.password}`);
    const body = req.body;
    if (!body.email || !body.password) {
        res.status(400).send("請求參數不正確");
        res.end();
    }

    let user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) {
        res.status(404).send("{ \"message\": \"帳號密碼錯誤\" }");
        res.end();
    }

    res.send(`{ \"message\": \"User ${user.email} login succeed.\" }`);
});

module.exports = router;