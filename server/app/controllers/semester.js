// Load SQL
var sql = require('./../sql.js');

exports.getSemesters = function (req, res) {
    var year = req.params['year'];

    sql.getSemesters(year, function(err, rows) {
        if(err) {
            res.json(400, { error: 'An error occurred.' });
            return;
        }

        res.json({
            semesters: rows
        });
    })
};

exports.getWeeks = function(req, res) {
    var semesterID = req.params['semesterID'];

    sql.getWeeks(semesterID, function(err, rows) {
        if(err) {
            res.json(400, { error: 'An error occurred.' });
            return;
        }

        res.json({
            weeks: rows
        });
    })
};
