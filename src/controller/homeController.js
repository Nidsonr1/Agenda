const Contato = require('../models/contatoModel');

exports.index = async(req, res, next) => {
  const contacts = await Contato.searchContacts(); 
  res.render('index', { contacts });
};
