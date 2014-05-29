'use strict';
 
angular.module('studlyApp')
  .factory('Subject', ['$resource' , function ($resource) {
    return $resource('/api/subject/:id', {id: '@id'}, {
    	getData: { method: 'GET' },
    	withdraw: { method: 'DELETE' },
		enrol: { method: 'POST' },
    })
}]);
