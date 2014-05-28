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

  // Attempt to find what we want
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
    res.json(data);
  });
};

exports.search = function(req, res) {
  var query = req.query['query'];

  // Make sure they entered a query
  if(!query) {
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

exports.addClasses = function(req, res) {
  if(!req.isAuthenticated()) {
    res.json(400, { error: 'You are not logged in.' });
    return;
  }

  var classTimes = req.body.classTimes;
  var subjectID = req.body.subjectID;
  var userID = req.user.userID;

  // Check their userID
  if(!userID) {
    res.json(403, { error: 'No userID passed.' });
    return;
  }

  // Ensure they gave us a subject ID
  if(!subjectID) {
    res.json(403, { error: 'No subjectID entered!' });
    return;
  }

  // Ensure it is an array
  if(!classTimes instanceof Array) {
    res.json(403, { error: 'classTimes is meant to be an array.' });
    return;
  }

  model.addClasses(userID, subjectID, classTimes, function(err) {
    // Check for errors
    if(err) {
      res.json(403, { error: 'There was an issue doing this.' });
      return;
    }

    // Send them the data
    res.json({ success: 1 });
  });
};

exports.deleteClasses = function(req, res) {
  if(!req.isAuthenticated()) {
    res.json(400, { error: 'You are not logged in.' });
    return;
  }

  var subjectID = req.body.subjectID;
  var userID = req.user.userID;

  // Check their userID
  if(!userID) {
    res.json(403, { error: 'No userID passed.' });
    return;
  }

  // Ensure they gave us a subject ID
  if(!subjectID) {
    res.json(403, { error: 'No subjectID entered!' });
    return;
  }

  model.deleteClasses(userID, subjectID, function(err) {
    // Check for errors
    if(err) {
      res.json(403, { error: 'There was an issue doing this.' });
      return;
    }

    // Send them the data
    res.json({ success: 1 });
  });
}