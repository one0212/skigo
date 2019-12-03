const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const figlet = require('figlet');
const jsonServer = require('json-server');
const fs = require('fs');
const appRoot = require('app-root-path');
const moment = require('moment-timezone');
const cors = require('cors');

const jRouter = jsonServer.router('db.json');
const log = require('./config/winston');
const userApi = require('./users/router');
const orderApi = require('./orders/router');
const coachApi = require('./coach/router');
const attractionApi =require('./attraction/router');
const attractionApiText =require('./attraction/router-text');
const areasApi = require('./areas/router');
const cartApi = require('./cart/router');
const correctLoginState = require('./middleware/correctLoginState');
const Constants = require('./utils/Constants');

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ credentials: true }));

// ============= Morgan ===================
morgan.token('date', (req, res, tz) => moment().tz(tz).format('YYYY-MM-DD HH:mm:ss'));
morgan.format('myformat', '[:date[Asia/Taipei]] ":method :url" :status - :response-time ms');
app.use(morgan('myformat', { stream: log.stream }));

// ============= Session ===================
app.use(session({
  name: Constants.COOKIE.SESSION_ID,
  secret: 'momo', // 之後再移到外部 config
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 學 netflix 存一年
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

// ============== reloadDB =================
const reloadDB = (req, res, next) => {
  const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  jRouter.db.setState(db);
  next();
};

// ============== Routes ====================
app.use(correctLoginState);
app.use('/api/user', userApi);
app.use('/api/order', orderApi);
app.use('/api/cart', cartApi);
app.use('/japi', reloadDB, jRouter);
app.use(coachApi);
app.use(areasApi);
app.use(attractionApi);
app.use(attractionApiText);
app.use(express.static('public'));
app.use(express.static('build'));

app.get('/*', (req, res) => {
  res.sendFile(`${appRoot.path}/build/index.html`);
});

app.listen(port, () => log.info(`Server started, listening on port ${port} \n ${banner}`));
