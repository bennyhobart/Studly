'use strict';

angular.module('studlyApp')
  .factory('subject', ['$resource' , function ($resource) {
    return $resource('/api/subject/:id', {id: '@id'})
  }]);
