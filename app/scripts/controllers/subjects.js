'use strict';

angular.module('studlyApp')
  .controller('SubjectsCtrl', function ($scope, $http) {
    
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.subjects = [];
    var exampleSubject = {
    	name: "Artificial Intelligence",
    	code: "COMP30050",
    	classes: [],
    };

    for (var i = 0; i<10; ++i) {
    	$scope.subjects.push(exampleSubject);
    }

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

    $scope.userAlert = function() {
      alert("_This will search for the subject code, then display the subject name and a prompt to confirm enrolment_");
    };
  });
