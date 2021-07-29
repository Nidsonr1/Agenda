const express = require('express');
const route = express.Router();

const homeController = require('./src/controller/homeController');
const loginController = require('./src/controller/loginController');


//Rotas Home
route.get('/', homeController.index);

//Rotas Login
route.get('/login', loginController.index);
route.post('/authentication/register', loginController.register)

module.exports = route;