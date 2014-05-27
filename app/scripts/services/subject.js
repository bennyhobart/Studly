'use strict';

angular.module('studlyApp')
  .factory('Subject', ['$resource' , function ($resource) {
    return $resource('/api/subject/:id', {id: "@id"})
  }]);
