import ordersController from './ordersController';

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => ordersController.createOrder(req, res));

module.exports = router;
