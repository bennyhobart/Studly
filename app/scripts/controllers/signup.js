'use strict';

angular.module('studlyApp')
  .controller('SignupCtrl', function ($scope, $location, $http, Auth) {
    $scope.submitForm = function () {
        console.log('send');
        Auth.createUser({
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            passwordRepeated: $scope.passwordRepeated
        }).then(function (data) {
                console.log(data);
                $location.url('/timetable');
            }, function (data) {
                console.log(data)
        });
    };
  });
