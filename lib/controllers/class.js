// Load the model
var model = require('./../models/class.js');

exports.getWeeklyClass = function (req, res) {
  var weeklyClassID = req.params['weeklyClassID'];

  // Make sure they passed us the ID
  if(!weeklyClassID) {
    res.json(403, { error: 'No weeklyClassID passed.' });
    return;
  }

  // Ask the model for the data
  model.getWeeklyClass(weeklyClassID, function(err, data) {
    if(err) {
      res.json(403, { error: 'Something went from with the query.' });
      return;
    }

    // Give the user their data
    res.json(data);
  });
};

exports.addThread = function (req, res) {

};

exports.deleteThread = function (req, res) {

};

exports.attendClass = function (req, res) {

};
