'use strict';

angular.module('studlyApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'views/navbar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the navbar directive');
      }
    };
  });
