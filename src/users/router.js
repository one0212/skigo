const express = require('express');

const router = express.Router();
const usersController = require('./usersController');

router.post('/signup', (req, res) => usersController.signup(req, res));
router.post('/login', (req, res) => usersController.login(req, res));
router.put('/active', (req, res) => usersController.activeUser(req, res));
router.put('/logout', (req, res) => usersController.logout(req, res));
router.post('/delivery-info', (req, res) => usersController.addDeliveryInfo(req, res));
// router.get('/delivery-info', (req, res) => usersController.getDeliveryInfoList(req, res));

module.exports = router;
