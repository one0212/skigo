const express = require('express')
const router = express.Router()
const usersController = require('./usersController')

router.post("/signup", (req, res) => usersController.signup(req, res))
router.post("/login", (req, res) => usersController.login(req, res))

module.exports = router;