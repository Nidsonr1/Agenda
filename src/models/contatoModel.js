const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  created_at: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
}

Contato.searchById = async function(id) {
  const user = await ContatoModel.findById(id);
  return user;
}

Contato.prototype.valida = function() {
  this.cleanUp();
  
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.name) this.errors.push('Nome é um campo obrigatório');
  if(!this.body.email && !this.body.phone) {
    this.errors.push('Pelo menos uma forma de contato precisa ser enviada. Email ou Telefone');
  }
};

//Garante que o objeto tenha apenas os campos necessários
Contato.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.name,
    lastName: this.body.lastName,
    phone: this.body.phone,
    email: this.body.email,
  }
}

module.exports = Contato