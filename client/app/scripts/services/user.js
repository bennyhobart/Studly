'use strict';

angular.module('studlyApp')
  .factory('User', function () {
    // Service logic
    // ...

    // Public API here
    return {
      getUsername: function() {

      },
      getPassword: function () {
        return meaningOfLife;
      },
    };
  });
