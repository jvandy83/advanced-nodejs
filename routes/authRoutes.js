const passport = require('passport');

module.exports = (_app) => {
  _app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  _app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/blogs');
    }
  );

  _app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  _app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
