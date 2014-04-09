'use strict';

angular.module('studlyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/timetable', {
        templateUrl: 'views/timetable.html',
        controller: 'TimetableCtrl'
      })
      .when('/class', {
        templateUrl: 'views/class.html',
        controller: 'ClassCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
