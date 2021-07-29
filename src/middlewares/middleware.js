exports.middlewareGlobal = (req, res, next) => {
 res.locals.errors = req.flash('errors'); 
 res.locals.success = req.flash('success');
  next();
};

exports.chechCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }
  next();
};

exports.crsfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}
