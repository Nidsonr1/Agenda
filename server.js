require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Conectando a base de dados
mongoose.connect(process.env.CONNECTIONSTRING, 
  {
    useNewUrlParser: true, useUnifiedTopology: true
  }
).then(() => {
  console.log('Banco de Dados conectado')
  app.emit('Pronto');
}).catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path')

const helmet = require('helmet');
const csrf = require('csurf')
const { middlewareGlobal, outroMiddleware, chechCsrfError, crsfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));

//Configurando Sessão
const sessionOptions = session({
  secret: 'qweasdzxcqazwsxedc',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});


//Utilizando as configurações da Sessão e o flash
app.use(sessionOptions);
app.use(flash());

app.use(express.static(path.resolve(__dirname, 'public')));

//Setando Views
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//Utilizando os middlewares e as rotas
app.use(csrf());
app.use(middlewareGlobal);
app.use(chechCsrfError); 
app.use(crsfMiddleware);
app.use(routes);

//Escutando o sinal do banco para executar o servidor
app.on('Pronto', () => {
  //Executa o servidor
  app.listen(3333, () => {console.log('Servidor rodando')});
})

