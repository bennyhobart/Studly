'use strict';

var app = angular.module('studlyApp');

app.controller('SubjectsCtrl', function ($scope) { 
  var AI = {
    name: "Artificial Intelligence",
	  code: "COMP30050",
  };
  var CS = {
    name: "Computer Systems",
    code: "COMP30123",
  };
  var Phil = {
    name: "Philosophy",
    code: "PHIL20057",
  };
  var UNIB = {
    name: "African Drumming",
    code: "UNIB10003",
  };
  var CHEM = {
    name: "Practical Chemistry",
    code: "CHEM20006",
  };

  $scope.enrolled = [CS, AI, Phil];

  $scope.subjects = [CS, AI, Phil, UNIB, CHEM];

  $scope.userAlert = function() {
    alert("_This will search for the subject code, then display the subject name and a prompt to confirm enrolment_");
  };
});

// app.directive('resize', function ($scope, $window) {
//   // Function to handle changes to style classes based on window width
//   var w = angular.element($window);

//   w.bind('resize', function() {
//     if (w.width() < 768) {
//       $scope.search-results.max-height = 150px;
//     };
//     if (w.width() >= 768) {
//       $scope.search-results.max-height = 400px;
//     };
//   });
// });