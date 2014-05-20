'use strict';

angular.module('studlyApp')
  .factory('Auth', function ($rootScope, $http, $location, User) {
    $rootScope.currentUser = null;

    // Public API here
    return {
      // Don't see a point why I should handle a callback here.
      login: function (loginInfo) {
        return $http.post("/api/session", loginInfo)
          .success(function(res) {
            console.log(res)
            $rootScope.currentUser = res;
            $location.path('/main');
          })
          .error(function(res) {
            $rootScope.currentUser = null;
          })
      },
      // Don't see a point why I should handle a callback here.
      logout: function () {
        return $http.delete("/api/session") 
          .success(function(res) {
            $rootScope.currentUser = null;
            $location.path('/login');
          })
          .error(function(res) {
            // do nothing
          })
      },
      createUser: function (passportInfo, callback) {
        var cb = callback || angular.noop;

        return User.save(passportInfo,
          function(user) {
            $rootScope.currentUser = user;
            return cb(user);
          },
          function(err) {
            return cb(err);
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
