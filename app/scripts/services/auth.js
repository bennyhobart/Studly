'use strict';

angular.module('studlyApp')
  .factory('Auth', function ($rootScope, $location, User, Session) {
    $rootScope.currentUser = null;

    // Public API here
    return {
      // Don't see a point why I should handle a callback here.
      login: function (loginInfo) {
        console.log(loginInfo);
        return Session.login(loginInfo, 
          function(res) {
            $rootScope.currentUser = res;
            $location.path('/main');
          }, function() {
            $rootScope.currentUser = null;
          }).$promise;
      },
      // Don't see a point why I should handle a callback here.
      logout: function () {
        return Session.logout(function() {
          $rootScope.currentUser = null;
          $location.path('/login');
        }, function(res) {
          console.log(res);
        }).$promise;
      },

      createUser: function (passportInfo, callback) {
        var cb = callback || angular.noop;

        return User.save(passportInfo,
          function(user) {
            $rootScope.currentUser = user;
          }).$promise;
      },

      currentUser: function () {
        return User.get();
      },

      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.update({
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;

      },

      isLoggedIn: function () {
        var user = $rootScope.currentUser;
        return !!user;
      }
    };
  });
