'use strict';

var session = require('./controllers/session'),
    _class = require('./controllers/class'),
    user = require('./controllers/user'),
    subject = require('./controllers/subject'),
    timetable = require('./controllers/timetable'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/session')
    .get(user.me)
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
  app.route('/api/timetable')
    .get(timetable.getWeeklyClasses)
    .post(timetable.addClass)
    .delete(timetable.deleteClass)
    .put(timetable.updateClass);



  app.route('/api/subject/:id')
    .get(subject.getSubject);

  app.route('/api/subject')
    .get(subject.search);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
  .get(index.index);
};