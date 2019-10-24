const express = require('express');
const app = express();
const memberRouter = require(`${__dirname}/routes/memberRouter`)
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

// Routers
app.use('/api/member', memberRouter);

app.listen(port, () => console.log(`Server started, listening on port ${port}`));