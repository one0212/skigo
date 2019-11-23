const express = require('express');

const router = express.Router();
const cartController = require('./cartController');

router.get('/', (req, res) => cartController.getCart(req, res));
router.post('/items', (req, res) => cartController.addItem(req, res));

module.exports = router;
