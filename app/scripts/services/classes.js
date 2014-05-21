'use strict';

angular.module('studlyApp')
  .factory('Classes',['$resource', function ($resource) {
    return $resource('/api/classes/:weeklyClassId/:ThreadId', {weeklyClassId: '@classId', ThreadId: '@ThreadId'});
  }]);
