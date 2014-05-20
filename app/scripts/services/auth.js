'use strict';

angular.module('studlyApp')
  .factory('Auth', function ($rootScope, $location, $cookieStore, User, Session) {

    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    // Public API here
    return {
      // Don't see a point why I should handle a callback here.
      login: function (loginInfo) {
        return Session.login(loginInfo,
          function(res) {
            console.log("login success")
            $rootScope.currentUser = res;
            $location.url('/main');
          }, function(res) {
            $rootScope.currentUser = null;
            console.log(res);
          }).$promise;
      },
      logout: function () {
        return Session.logout(function() {
          $rootScope.currentUser = null;
          $location.url('/login');
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
