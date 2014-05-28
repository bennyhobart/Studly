'use strict';

angular.module('studlyApp')
  .controller('ProfileCtrl', function ($scope, Session, User) {
    $scope.init = function() {
        Session.get().$promise.then(
            function (data) {
                $scope.data = data;
            }, function (data) {
            });

    };

    $scope.deleteAccount = function() {
        User.delete({
            password: $scope.deleteAccountPassword
        }).$promise.then(function (data) {
        }, function (data) {
        });
    };
    $scope.changePassword = function () {
        User.update({
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword,
            newPasswordRepeated: $scope.newPasswordRepeated,
        }).$promise.then(function (data) {
        }, function (data) {
        });

    };
  });
