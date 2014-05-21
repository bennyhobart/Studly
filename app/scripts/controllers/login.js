'use strict';

angular.module('studlyApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    if(Auth.isLoggedIn()) {
      $location.url('/timetable');
    }
    $scope.submitForm = function() {
      var passportInfo = {
        username: $scope.username,
        password: $scope.password
      };
      Auth.login(passportInfo).then(function (data) {
        $location.url('/timetable');
      }, function (data) {
        console.log('error')
      });
    }
  });
