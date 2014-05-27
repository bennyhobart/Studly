// Load the model
var model = require('./../models/subject.js');

// Gets tjhe classes for a given subject
exports.getSubject = function(req, res) {
  var subjectID = req.params['subjectID'];

  // Make sure they entered something
  if(!subjectID) {
    res.json(403, { error: 'No subjectID entered.' });
    return;
  }

  // Attemp
  model.getSubject(subjectID, function(err, data) {
    // Check for errors
    if(err) {
      res.json(403, { error: 'There was a problem finding matches.' });
      return;
    }

    // Make sure we got some data to send
    if(data.length <= 0) {
      res.json(403, { error: 'No classes found.' });
      return;
    }

    // Send them the data
    res.json({ subjects: rows });
  });
};

exports.search = function(req, res) {
  var query = req.query['query'];

  // Make sure they entered a query
  if(!query) {
    //console.log(req)
    res.json(403, { error: 'No query entered.' });
    return;
  }

  // Get the model data
  model.search(query, function(err, rows) {
    // Check for errors
    if(err) {
      res.json(403, { error: 'There was a problem finding matches.' });
      return;
    }

    // Make sure we got some data to send
    if(rows.length <= 0) {
      res.json(403, { error: 'No subjects found.' });
      return;
    }

    // Send them the data
    res.json({ subjects: rows });
  });
};

exports.getClasses = function(req, res) {

};
