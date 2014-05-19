'use strict';

angular.module('studlyApp')
  .factory('timetable',['$resource', function ($resource) {
    return $resource('/api/timetable', null, {
      update: { method: 'PUT' }
    });
  }]);
