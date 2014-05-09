module.exports = function(app, passport) {
  session = require('controllers/session');
  _class = require('controllers/class');
  user = require('controllers/user');
  subject = require('controllers/subject');


  /* STANDARD ROUTING */
  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.sendfile('client/app/views/main.html');
    } else {
      res.sendfile('client/app/index.html');
    }
  });

  app.route('/api/session')
    .get(session.me)
    .post(session.login)
    .delete(session.logout);

  app.route('/api/user')
    .get(user.getPublicProfile)
    .post(user.register)
    .delete(user.deregister)
    .put(user.updatePassword);

  app.route('/api/class')
    .get(_class.getWeeklyClass)
    .post(_class.addThread)
    .delete(_class.deleteThread)
    .put(_class.attendClass);



  app.route('/api/subject/:id')
    .get(subject.getSubject);

  app.route('/api/subject')
    .get(subject.search);

  app.route('/api', function (req, req) {
    req.send(404, 'No API Found');
  });


  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/login', passport.authenticate('local', {
      successRedirect : '/',
      failureRedirect : '/',
      failureFlash: true
    })
  );

  /* API */

}