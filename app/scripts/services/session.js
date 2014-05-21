'use strict';

angular.module('studlyApp')
  .factory('Session',['$resource', function ($resource) {
    return $resource('/api/session', null, {
        login: { method: 'POST' },
        logout: { method: 'DELETE' },
        update: { method: 'PUT' }
    });

}]);
