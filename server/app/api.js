module.exports = function(app, passport) {
  var session = require('./controllers/session');
  var _class = require('./controllers/class');
  var user = require('./controllers/user');
  var subject = require('./controllers/subject');
  var semester = require('./controllers/semester');
  var classes = require('./controllers/classes');
  var forum = require('./controllers/forum');


  /* STANDARD ROUTING */
  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.sendfile('client/app/views/main.html');
    } else {
      res.sendfile('client/app/index.html');
    }
  });

  app.route('/api/user/session')
    .get(user.me);

  // Get a user's public profile
  app.route('/api/user/get/:userID')
    .get(user.getPublicProfile);

  // Register a new user
  app.route('/api/user/register')
    .post(user.register);

  // Log a user in
  app.route('/api/user/login')
    .post(session.login);

  app.route('/api/user/logout')
    .get(session.logout);

  // Update a user's password
  app.route('/api/user/updatePassword')
    .post(user.updatePassword);

  /*app.route('/api/class')
    .get(_class.getWeeklyClass)
    .post(_class.addThread)
    .delete(_class.deleteThread)
    .put(_class.attendClass);*/

  // Class Related stuff
  app.route('/api/classes/times/:classID')
    .get(classes.getTimes);

  app.route('/api/classes/weekly/:classID')
    .get(classes.getWeeklyClasses);

  // Semester related stuff
  app.route('/api/semester/find/:year')
    .get(semester.getSemesters);

  app.route('/api/semester/weeks/find/:semesterID')
    .get(semester.getWeeks);

  // Find Classes
  app.route('/api/subject/findClasses/:subjectID')
    .get(subject.getClasses);

  // Register into a subject
  app.route('/api/user/subject/register')
    .post(user.registerIntoSubject);

  // Remove a subject for a user
  app.route('/api/user/subject/remove')
    .post(user.removeFromSubject);

  // Register into the given class time
  app.route('/api/user/classTime/register')
    .post(user.registerIntoClassTime);

  // Remove a user from the given class time
  app.route('/api/user/classTime/remove')
    .post(user.removeClassTime);

  // Get a user's timetable
  app.route('/api/user/timetable/get/:semesterID')
    .get(user.getTimetable);

  // Gets the attended state for a given semester and week
  app.route('/api/user/attended/get/:semesterID/:weekNumber')
    .get(user.getAttended);

  // Mark a class as attended
  app.route('/api/user/class/markAttended')
    .post(user.markClassAttended);

  /*
    Forum Stuff
  */

  // Find all topics for a given weekly class
  app.route('/api/topics/find/:weeklyClassID')
    .get(forum.findTopics);

  // Create a new topic
  app.route('/api/topics/create')
    .post(forum.createTopic);

  // Find all posts for the given topicID
  app.route('/api/posts/find/:topicID')
    .get(forum.findPosts);

  // Create a new topic
  app.route('/api/topics/create')
    .post(forum.createTopic);

  // Create a new post
  app.route('/api/posts/create')
    .post(forum.createPost);



  /*app.route('/api/subject')
    .get(subject.search);*/

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