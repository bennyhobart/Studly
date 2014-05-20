'use strict';

angular.module('studlyApp')
  .controller('LoginCtrl', function ($scope, Auth) {
    $scope.submitForm = function() {
      var passportInfo = {
        username: $scope.email,
        password: $scope.password
      };
      Auth.login(passportInfo); 
    }
  });
