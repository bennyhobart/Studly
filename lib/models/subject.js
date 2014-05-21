var sql = require('./../config/sql.js');

exports.getSubject = function (req, res) {

};

exports.search = function (query, callback) {
  sql.getConnection(function(err, connection) {
    if(err) {
      connection.release();
      return callback(err);
    }

    // Turn it into a mysql matching query
    query = '%'+query+'%';

    // Search by subject code
    connection.query('SELECT subjectID, subjectName, semesterID, semesterName FROM `Subject` NATURAL JOIN `Semester` WHERE `subjectCode` LIKE ? OR `subjectName` LIKE ? LIMIT 10;', [query, query], function(err, rows) {
      if(err) {
        connection.release();
        return callback(err);
      }

      // Release the connection
      connection.release();

      // Run callback
      callback(null, rows);
    });
  });
};
