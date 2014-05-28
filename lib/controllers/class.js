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
    // Check for errors
    if(err) {
      res.json(403, { error: 'Something went from with the query.' });
      return;
    }

    // Give the user their data
    res.json(data);
  });
};

exports.addThread = function (req, res) {
  // Auth user
  if(!req.isAuthenticated()) {
      res.json(403, { error: 'You are not logged in.' });
      return;
  }

  var userID = req.user.userID;
  var title = req.body['title'];
  var body = req.body['body'];
  var weeklyClassID = req.params['weeklyClassID'];

  // Validate fields
  if(!userID) {
    res.json(403, { error: 'Failed to find your userID, sorry.' });
    return;
  }

  if(!weeklyClassID) {
    res.json(403, { error: 'No weeklyClassID passed.' });
    return;
  }

  if(!title) {
    res.json(400, { error: 'No title entered.' });
    return;
  }

  if(!body) {
    res.json(400, { error: 'No body entered.' });
    return;
  }

  // Validate length of topic / body?

  model.addThread(userID, weeklyClassID, title, body, function(err, topicID) {
    // Check for errors
    if(err) {
      res.json(403, { error: 'Something went from with the query.' });
      return;
    }

    // Give the user their data
    res.json({
      topicID: topicID
    });
  })
};

exports.deleteThread = function (req, res) {

};

exports.attendClass = function (req, res) {
  // Auth user
  if(!req.isAuthenticated()) {
      res.json(403, { error: 'You are not logged in.' });
      return;
  }

  var userID = req.user.userID;
  var weeklyClassID = req.params['weeklyClassID'];
  var attendedFlag = req.body.attendedFlag;

  // Validate fields
  if(!userID) {
    res.json(403, { error: 'Failed to find your userID, sorry.' });
    return;
  }

  if(!weeklyClassID) {
    res.json(403, { error: 'No weeklyClassID passed.' });
    return;
  }

  if(attendedFlag == null) {
    res.json(403, { error: 'No attendedFlag passed.' });
    return;
  }

  model.attendClass(userID, weeklyClassID, attendedFlag, function(err) {
    // Check for errors
    if(err) {
      console.log(err);
      res.json(403, { error: 'Failed to mark class as attended.' });
      return;
    }

    // Give the user their data
    res.json({ success: 1 });
  });
};

exports.getPosts = function(req, res) {
  var topicID = req.params['topicID'];

  // Ignore weeklyClassID

  // Make sure they passed the ID
  if(!topicID) {
    res.json(403, { error: 'No topicID passed.' });
    return;
  }

  model.getPosts(topicID, function(err, data) {
    // check for errors
    if(err) {
      res.json(403, { error: 'Something went from with the query.' });
      return;
    }

    // Give the user their data
    res.json(data);
  })
};

exports.addPost = function(req, res) {
  var userID = req.user.userID;
  var content = req.body['content'];
  var topicID = req.params['topicID'];

  // Validate fields
  if(!userID) {
    res.json(403, { error: 'Failed to find your userID, sorry.' });
    return;
  }

  if(!content) {
    res.json(403, { error: 'No content passed.' });
    return;
  }

  if(!topicID) {
    res.json(403, { error: 'No topicID passed.' });
    return;
  }

  // Attempt to add the post
  model.addPost(userID, topicID, content, function(err, postID) {
    // Check for errors
    if(err) {
      res.json(403, { error: 'Something went from with the query.' });
      return;
    }

    // Give the user their data
    res.json({
      postID: postID
    });
  });
};

exports.voteOnTopic = function(req, res) {
  var userID = req.user.userID;
  var vote = req.body['vote'];
  var topicID = req.params['topicID'];

  // Validate fields
  if(!userID) {
    res.json(403, { error: 'Failed to find your userID, sorry.' });
    return;
  }

  if(vote == null) {
    res.json(403, { error: 'No vote passed.' });
    return;
  }

  if(!topicID) {
    res.json(403, { error: 'No topicID passed.' });
    return;
  }

  // Check for valid votes
  if(vote != 0 && vote != -1 && vote != 1) {
    res.json(403, { error: 'A vote can only be -1, 0 or 1.' });
    return;
  }

  // Attempt to add the post
  model.voteOnTopic(userID, topicID, vote, function(err, upVotes, downVotes) {
    // Check for errors
    if(err) {
      console.log(err);
      res.json(403, { error: 'Something went from with the query.' });
      return;
    }

    // Give the user their data
    res.json({
      upVotes: upVotes,
      downVotes: downVotes
    });
  });
};

exports.deletePost = function(req, res) {

};

exports.editPost = function(req, res) {

};
