'use strict';

var app = angular.module('studlyApp');

app.controller('SubjectsCtrl', function ($scope, Subject) {

  var AI = {
    name: 'Artificial Intelligence',
    code: 'COMP30050',
    semester: '1',
    subjectID: 1,
  };
  var CS = {
    name: 'Computer Systems',
    code: 'COMP30123',
    semester: '1',
    subjectID: 2,
  };
  var Phil = {
    name: 'Philosophy',
    code: 'PHIL20057',
    semester: '2',
    subjectID: 3,
  };
  var UNIB = {
    name: 'African Drumming',
    code: 'UNIB10003',
    semester: '1',
    subjectID: 4,
  };
  var CHEM2 = {
    name: 'Practical Chemistry',
    code: 'CHEM20006',
    semester: '2',
    subjectID: 5,
  };
  var Poet = {
    name: 'Poetry: A Historical Analysis',
    code: 'HIST20407',
    semester: '1',
    subjectID: 6,
  };
  var Span = {
    name: 'Introduction to Spanish',
    code: 'LANG10030',
    semester: '2',
    subjectID: 7,
  };
  var CHEM1 = {
    name: 'Theoretical Chemistry',
    code: 'CHEM20007',
    semester: '1',
    subjectID: 8,
  };

  $scope.colours = [
    {name:'red'},
    {name:'blue'},
    {name:'orange'},
    {name:'green'},
  ];

  $scope.enrolled = [CS, AI, Phil, CHEM1];

  $scope.subjects = [];

  $scope.querySubject = function() {
    console.log($scope.queryField)
    Subject.get({
      query: $scope.queryField
    }).$promise.then(
      //success
      function (data) {
        console.log(data)
        angular.forEach(data.subjects, function() {

        })
        $scope.subjects = data.subjects;
        console.log($scope.subjects);
      },
      //failure
      function (data) {
        console.log(data);
      }
    );
  }

  $scope.subjects.sort(function(a, b) {
    return a.code - b.code;
  });

  // $scope.goToSubject = function(subjectID) {
  //   $rootParams.subjectID = subjectID;
  //   $location.url('/subject');
  // };
});