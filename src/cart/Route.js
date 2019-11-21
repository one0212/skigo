const express = require('express');

const router = express.Router();
const CartController = require('./CartController');

router.get('/', (req, res) => CartController.getCart(req, res));
router.post('/items', (req, res) => CartController.addItem(req, res));

module.exports = router;
