'use strict';

angular.module('studlyApp')
  .factory('session',['$resource', function ($resource) {
    return $resource('/api/session', paramDefaults,{
       update: { method: 'PUT' }
    });

  }]);
