const express = require('express');
const session = require('express-session');
const userApi = require('./users/router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'momo', // 之後再移到外部 config
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60 * 60 * 24 * 365, // 學 netflix 存一年
    httpOnly: true,
    // secure: true 需要搭配 https才能啟用
  },
}));

app.use('/api/user', userApi);

app.listen(port, () => console.log(`Server started, listening on port ${port}`));
