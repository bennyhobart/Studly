'use strict';

angular.module('studlyApp')
  .controller('SignupCtrl', function ($scope, $location, $http, Auth) {
    $scope.submitForm = function () {
        console.log('send');
        Auth.createUser({
            email: $scope.email,
            password: $scope.password,
            passwordRepeated: $scope.passwordRepeated
        }, function (a) {
            console.log(a)
        });
    };
  });
