const express = require('express');
const app = express();
const memberRouter = require('routes/memberRouter')
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Routers
app.use('/api/member', memberRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));