'use strict';

angular.module('studlyApp')
  .directive('navbar', [ '$location', function ($location) {
    return {
      templateUrl: 'partials/navbar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the navbar directive');
        scope.isActive = function(route) {
            return route === $location.path();
        };
      }
    };
  }]);
