module.exports = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login.html');
    }
    next(); // Якщо сесія є, продовжуємо обробку запиту
  };