'use strict';

angular.module('studlyApp')
  .factory('User', ['$resource' , function ($resource) {
    return $resource('/api/user', null, {
        update: { method: 'PUT'}
    });

  }]);
