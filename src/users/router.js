const express = require('express');

const router = express.Router();
const usersController = require('./usersController');

router.get('/isLogin', (req, res) => usersController.isLogin(req, res));
router.post('/signup', (req, res) => usersController.signup(req, res));
router.post('/login', (req, res) => usersController.login(req, res));

module.exports = router;
