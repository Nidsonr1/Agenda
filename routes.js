const express = require('express');
const route = express.Router();

const homeController = require('./src/controller/homeController');
const loginController = require('./src/controller/loginController');
const contatoController = require('./src/controller/contatoController');

const { loginRequired } = require('./src/middlewares/middleware');

//Rotas Home
route.get('/', homeController.index);

//Rotas Login
route.get('/login', loginController.index);
route.post('/authentication/register', loginController.register);
route.post('/authentication/login', loginController.login);
route.get('/authentication/logout', loginController.logout);

//Rotas Contato
route.get('/contato', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);


module.exports = route;