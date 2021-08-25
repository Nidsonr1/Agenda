const Contato = require('../models/contatoModel');

exports.index = (req, res, next) => {
  res.render('contato', {
    contact: {}
  });
};

exports.register = async (req, res, next) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => { res.redirect('/contato') });
      return;
    }
    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() => { res.redirect(`/contato/${contato.contato._id}`) });
    return;
  } catch (e) {
    console.log(e);
    res.render(404);
    return;
  }
};

exports.editIndex = async (req, res) => {
  try {
    if(!req.params.id) return res.render(404);
    const contact = await Contato.searchById(req.params.id);
    if(!contact) return res.render('404');

    res.render('contato', { contact });
  } catch(e) {
    console.log(e);
  }
};

exports.edit = async (req, res) => {
  try {
    if(!req.params.id) return res.render(404);
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);
    
    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => { res.redirect('/contato') });
      return;
    }
    req.flash('success', 'Contato Editado com sucesso!');
    req.session.save(() => { 
      res.redirect(`/contato/${contato.contato._id}`) 
    });
  } catch (e) {
    console.log(e);
    res.render(404);
  }
};
