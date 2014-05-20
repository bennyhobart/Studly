'use strict';

angular.module('studlyApp')
  .directive('navbar', [ '$location', 'Auth', function ($location, Auth) {
    return {
      templateUrl: 'partials/navbar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the navbar directive');
        scope.loggediIn = Auth.isLoggedIn();
        scope.isActive = function(route) {
            return route === $location.path();
        };
      }
    };
  }]);
