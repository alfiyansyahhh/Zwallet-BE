const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const usersRouter = require('./src/route/users.route');
const transactionsRouter = require('./src/route/transactions.router');

const app  = express()
app.use(cors())
app.use(bodyparser.json())
app.use(usersRouter);
app.use(transactionsRouter);

app.get('/', (req, res) => {
    res.json({
      succes: true,
      msg:'it works',
    });
  });

app.use("/uploads", express.static(__dirname + "/image/uploads"))
app.use("/helpers", express.static(__dirname + "/image/helpers"))

const PORT = 2000
app.listen(PORT, () => {
    console.log(`Service running on Port ${PORT}`);
});

module.exports = app;