const express = require('express')
const userApi = require('./users/router')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.static('public'))
app.use('/api/user', userApi)

app.listen(port, () => console.log(`Server started, listening on port ${port}`))