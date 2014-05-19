'use strict';

angular.module('studlyApp')
  .factory('user', ['$resource' , function ($resource)) {
    return $resource('/api/user');
  });
