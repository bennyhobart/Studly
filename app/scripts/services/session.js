'use strict';

angular.module('studlyApp')
  .factory('Session',['$resource', function ($resource) {
    return $resource('/api/session', null,{
        update: { method: 'PUT' }
    });

}]);
