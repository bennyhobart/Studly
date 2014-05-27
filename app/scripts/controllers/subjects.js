'use strict';

var app = angular.module('studlyApp');

app.controller('SubjectsCtrl', function ($scope, $http, Subject) {
  /*
  Subject.query({
    query: 'COMP',
  }).$promise.then(
    //success
    function (data) {
      console.log(data);
    },
    //failure
    function (data) {
      console.log(data);
    }
  );
  */
  var AI = {
    name: "Artificial Intelligence",
    code: "COMP30050",
    semester: "1",
  };
  var CS = {
    name: "Computer Systems",
    code: "COMP30123",
    semester: "1",
  };
  var Phil = {
    name: "Philosophy",
    code: "PHIL20057",
    semester: "2",
  };
  var UNIB = {
    name: "African Drumming",
    code: "UNIB10003",
    semester: "1",
  };
  var CHEM2 = {
    name: "Practical Chemistry",
    code: "CHEM20006",
    semester: "2",
  };
  var Poet = {
    name: "Poetry: A Historical Analysis",
    code: "HIST20407",
    semester: "1",
  };
  var Span = {
    name: "Introduction to Spanish",
    code: "LANG10030",
    semester: "2",
  };
  var CHEM1 = {
    name: "Theoretical Chemistry",
    code: "CHEM20007",
    semester: "1",
  };

  $scope.colours = [
    {name:'red'},
    {name:'blue'},
    {name:'orange'},
    {name:'green'},
  ];

  $scope.enrolled = [CS, AI, Phil, CHEM1];

  $scope.subjects = [CS, AI, Phil, UNIB, CHEM1, CHEM2, Poet, Span];

  $scope.querySubject = function(query) {
    return $http.get("/api/subject", { params : {query : query} })
      .then(function(res) {
        var subjects = []
        angular.forEach(res.data.subjects, function(item) {
          subjects.push([item.subjectName, item.semesterName]);
        });
        return subjects;
      })
  }

  $scope.subjects.sort(function(a, b) {
    return a.code - b.code;
  });
});