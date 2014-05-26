'use strict';

angular.module('studlyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/login.html',
      //   controller: 'LoginCtrl'
      // })
      .when('/timetable', {
        templateUrl: 'partials/timetable.html',
        controller: 'TimetableCtrl',
        authenticate: true
      })
      .when('/class', {
        templateUrl: 'partials/class.html',
        controller: 'ClassCtrl',
        authenticate: true
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/subjects', {
        templateUrl: 'partials/subjects.html',
        controller: 'SubjectsCtrl',
        authenticate: true
      })
      .when('/subject', {
        templateUrl: 'partials/subject',
        controller: 'SubjectCtrl',
        authenticate: true
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
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .otherwise({
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      });

      $locationProvider.html5Mode(true);
      // Intercept 401s and redirect you to login
      $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
        return {
          'responseError': function(response) {
            if(response.status === 401) {
              $location.path('/login');
              return $q.reject(response);
            }
            else {
              return $q.reject(response);
            }
          }
        };
      }]);
    })
    .run(function ($rootScope, $location, Auth) {
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$routeChangeStart', function (event, next) {

        if (next.authenticate && !Auth.isLoggedIn()) {
          $location.path('/login');
        }
    });
  });
