// Load the model
var model = require('./../models/timetable.js');

exports.getWeeklyClasses = function (req, res) {
  if(!req.isAuthenticated()) {
    res.json(400, { error: 'You are not logged in.' });
    return;
  }

  // Grab data
  var startDate = req.query.date;
  var userID = req.user.userID;

  // Check their userID
  if(!userID) {
    res.json(403, { error: 'No userID passed.' });
    return;
  }

  if(!startDate) {
    res.json(403, { error: 'No date passed!' });
    return;
  }

  model.getWeeklyClasses(userID, startDate, function(err, data) {
    // Check for errors
    if(err) {
      console.log(err);
      res.json(403, { error: 'There was an issue doing this.' });
      return;
    }

    // Send them the data
    res.json(data);
  });
}

exports.addClass = function (req, res) {

}

exports.deleteClass = function (req, res) {

}

exports.updateClass = function (req, res) {

}