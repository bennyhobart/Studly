'use strict';

angular.module('studlyApp')
  .factory('timetable',['$resource', function ($resource) {
    return $resource('/api/timetable', null, {
      update: { method: 'PUT' }
    });
  }]);

  var currentDate = new Date();
  var weekNumber = today.getWeek();

  timetable.get({date: "DATE"}, function(data) {
  	console.log(data);
  });