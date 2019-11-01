const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const figlet = require('figlet');
const log = require('./config/winston');
const userApi = require('./users/router');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined', { stream: log.stream }));
app.use(express.json());
app.use(express.static('public'));

// ============= Session ===================
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

// ============== Banner ====================
const banner = figlet.textSync('SKIGO !!!', {
  font: 'ghost',
  horizontalLayout: 'full',
  verticalLayout: 'full',
});

// ============== Routes ====================
app.use('/api/user', userApi);

app.listen(port, () => log.info(`Server started, listening on port ${port} \n ${banner}`));
