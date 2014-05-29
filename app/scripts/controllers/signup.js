'use strict';

angular.module('studlyApp')
  .controller('SignupCtrl', function ($scope, $location, $http, Auth) {
    if(Auth.isLoggedIn) {
        $location.url('/timetable');
    }
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
                alert(data.data.error);
        });
    };
  });
