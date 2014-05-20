'use strict';

angular.module('studlyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/login.html',
      //   controller: 'LoginCtrl'
      // })
      .when('/timetable', {
        templateUrl: 'partials/timetable.html',
        controller: 'TimetableCtrl'
      })
      .when('/class', {
        templateUrl: 'partials/class.html',
        controller: 'ClassCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/subjects', {
        templateUrl: 'partials/subjects.html',
        controller: 'SubjectsCtrl'
      })
      .when('/subject', {
        templateUrl: 'partials/subject',
        controller: 'SubjectCtrl'
      })
      .when('/about', {
        templateUrl: 'partials/about',
        controller: 'AboutCtrl'
      })
      .when('/contact', {
        templateUrl: 'partials/contact',
        controller: 'ContactCtrl'
      })
      .when('/profile', {
        templateUrl: 'partials/profile',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });

      $locationProvider.html5Mode(true);
  });
