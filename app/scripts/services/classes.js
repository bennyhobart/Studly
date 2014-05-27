'use strict';

angular.module('studlyApp')
  .factory('Class',['$resource', function ($resource) {
    return $resource('/api/class/:weeklyClassId/:topicId', {weeklyClassId: '@weeklyClassId', topicId: '@topicId'});
  }]);
