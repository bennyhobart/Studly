'use strict';

angular.module('studlyApp')
  .controller('ProfileCtrl', function ($scope, Session, User) {
    $scope.init = function() {
        Session.get().$promise.then(
            function (data) {
                $scope.data = data;
            }, function (data) {
                alert(data.data.error);
            });

    };

    $scope.deleteAccount = function() {
        User.delete({
            password: $scope.deleteAccountPassword
        }).$promise.then(function (data) {
        }, function (data) {
            alert(data.data.error);
        });
    };
    $scope.changePassword = function () {
        User.update({
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword,
            newPasswordRepeated: $scope.newPasswordRepeated,
        }).$promise.then(function (data) {
            alert('Password Change Successful!');
        }, function (data) {
            alert(data.data.error);
        });

    };
  });
