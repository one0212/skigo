const express = require('express');

const router = express.Router();
const usersController = require('./usersController');

router.get('/isLogin', (req, res) => usersController.isLogin(req, res));
router.post('/signup', (req, res) => usersController.signup(req, res));
router.post('/login', (req, res) => usersController.login(req, res));
router.put('/active', (req, res) => usersController.activeUser(req, res));

module.exports = router;
