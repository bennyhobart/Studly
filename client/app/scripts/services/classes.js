'use strict';

angular.module('studlyApp')
  .factory('classes',['$resource', function ($resource) {
    return $resource('/api/classes/:weeklyClassId/:ThreadId', {weeklyClassId: '@classId', ThreadId: 'ThreadId'});
  }]);
