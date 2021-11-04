const express = require('express');
const authen = require('../middleware/authentication');
const upload = require('../middleware/upload');


const { 
    getAll, 
    register,
    update,
    getDetail,
    login,
    insertPin,
    loginPin,
} = require('../controller/users.controller');

const usersRouter = express.Router();

usersRouter
.get('/users', authen, getAll)
.get('/detailUser/:id',authen, getDetail)
.post('/register', register)
.post('/insertPin', authen, insertPin)
.post('/login', login)
.post('/loginPin',authen, loginPin)
.put('/update/user',authen, upload, update)

module.exports = usersRouter;