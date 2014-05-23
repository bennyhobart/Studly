'use strict';

angular.module('studlyApp')
  .factory('Timetable',['$resource', function ($resource) {
    return $resource('/api/timetable', null, {
      update: { method: 'PUT' }
    });
  }]);

