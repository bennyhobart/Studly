'use strict';

angular.module('studlyApp')
  .factory('timetable',['$resource', function ($resource) {
    return $resource('/api/timetable', paramDefaults, {
      update: { method: 'PUT' }
    });
  }]);
