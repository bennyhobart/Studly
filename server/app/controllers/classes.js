// Load SQL
var sql = require('./../sql.js');

exports.getTimes = function(req, res) {
    var classID = req.params['classID'];

    sql.getTimes(classID, function(err, rows) {
        if(err) {
            res.json(400, { error: 'An error occurred.' });
            return;
        }

        res.json({
            times: rows
        });
    });
};

exports.getWeeklyClasses = function(req, res) {
    var classID = req.params['classID'];

    sql.getWeeklyClasses(classID, function(err, rows) {
        if(err) {
            res.json(400, { error: 'An error occurred.' });
            return;
        }

        res.json({
            classes: rows
        });
    });
};
