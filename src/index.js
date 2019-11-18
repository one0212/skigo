const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const figlet = require('figlet');
const jsonServer = require('json-server');
const fs = require('fs');

const jRouter = jsonServer.router('db.json');
const cors = require('cors');
const log = require('./config/winston');
const userApi = require('./users/router');
const setRole = require('./middleware/setRole');
const Constants = require('./utils/Constants');

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('combined', { stream: log.stream }));

// ============= CORS ===================
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    callback(null, true);
  },
};
app.use(cors(corsOptions));

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
app.use(setRole);
app.use('/api/user', userApi);
app.use('/japi', reloadDB, jRouter);

app.listen(port, () => log.info(`Server started, listening on port ${port} \n ${banner}`));
