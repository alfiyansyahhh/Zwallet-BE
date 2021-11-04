const express = require('express');
const authen = require('../middleware/authentication');

const { 
    getTransactionsDetails, getTransactionsUser, insert, topUp, transfer
} = require('../controller/transactions.controllers');

const transactionRouter = express.Router();

transactionRouter
.get('/transactionDetails/:id', authen, getTransactionsDetails)
.get('/transactionUsers', authen, getTransactionsUser)
.post('/insert', insert)
.post('/topUp',authen, topUp)
.post('/transfer',authen, transfer)


module.exports = transactionRouter;