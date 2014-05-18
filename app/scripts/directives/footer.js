'use strict';

angular.module('studlyApp')
  .directive('footer', function () {
    return {
      templateUrl: 'views/footer.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the footer directive');
      }
    };
  });
