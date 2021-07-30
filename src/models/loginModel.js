const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  };

  //Loga Usuário
  async login() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    //Passa erro caso nãopexista usuário
    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }
    
    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null
      return;
    }
  }

  //Registra usuário
  async register() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    //Passa erro caso já exista usuário
    if(this.user) {
      this.errors.push('Usuário já existe')
      return;
    }
   
    //Gerando Salt
    const salt = bcryptjs.genSaltSync();

    //Hash para senha 
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  };

  async userExists() {
    try{
      this.user = await LoginModel.findOne({ email: this.body.email });
    } catch(e) {
      console.log(e)
    }
  }
  //Valida os Dados
  valida() {
    this.cleanUp();
    
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    if(this.body.password.length < 3 || this.body.password.length >= 50){
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
    }
  };

  //Garante que o objeto tenha apenas os campos necessários
  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login