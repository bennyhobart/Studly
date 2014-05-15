// Load SQL
var sql = require('./../sql.js');

exports.findTopics = function(req, res) {
    var weeklyClassID = req.params['weeklyClassID'];

    sql.findTopics(weeklyClassID, function(err, rows) {
        if(err) {
            res.json(400, { error: 'An error occurred.' });
            return;
        }

        res.json({
            topics: rows
        });
    });
};

exports.createTopic = function(req, res) {
    var weeklyClassID = req.body['weeklyClassID'];
    var title = req.body['title'];

    sql.createTopic(req.user.userID, weeklyClassID, title, function(err, success) {
        if(err || !success) {
            res.json(400, { error: 'Failed to create topic.' });
            return;
        }

        // It worked, send success message
        res.json({ success: 1 });
    });
};

exports.createPost = function(req, res) {
    var topicID = req.body['topicID'];
    var content = req.body['content'];

    sql.createPost(req.user.userID, topicID, content, function(err, success) {
        if(err || !success) {
            res.json(400, { error: 'Failed to create post.' });
            return;
        }

        // It worked, send success message
        res.json({ success: 1 });
    });
};

exports.findPosts = function(req, res) {
    var topicID = req.params['topicID'];

    sql.findPosts(topicID, function(err, rows) {
        if(err) {
            res.json(400, { error: 'An error occurred.' });
            return;
        }

        res.json({
            posts: rows
        });
    });
};
