'use strict';

angular.module('studlyApp')
  .factory('Auth', function ($rootScope, $http, $location, User) {
    $rootScope.currentUser = null;

    // Public API here
    return {
      login: function (user) {
        return Session.save({
          email: user.email,
          password: user.password
        }, function(user) {
          $rootScope.currentUser = user;
        }).$promise;
      },
      logout: function () {
        return Session.delete(function() {
            $rootScope.currentUser = null;
          }).$promise;
      },
      createUser: function (user) {
        return User.save(user,
          function (user) {
            $rootScope.currentUser = user;
          }).$promise;
      },

      currentUser: function () {
        return User.get();
      },
      changePassword: function (oldPassword, newPassword) {
        return User.update({
          oldPassword: oldPassword,
          newPassword: newPassword
        }).$promise;

      },
      isLoggedIn: function () {
        var user = $rootScope.currentUser;
        return !!user;
      }
    };
  });
