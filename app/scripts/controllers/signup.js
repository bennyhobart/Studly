'use strict';

angular.module('studlyApp')
  .controller('SignupCtrl', function ($scope, $location, $http, Auth) {
    $scope.submitForm = function () {
        if ($scope.password!=$scope.passwordConfirm) {
            return;
        }
        Auth.createUser({
            email: $scope.email,
            password: $scope.password,
            passwordRepeated: $scope.passwordRepeated
        }, function (err) {
            if(err) {
                console.log(err);
                return;
            }
            $location.url('/timetable');
        });
    };
  });
