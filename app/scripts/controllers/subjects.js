'use strict';

angular.module('studlyApp')
  .controller('SubjectsCtrl', function ($scope) {
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

    $scope.userAlert = function() {
      alert("_This will search for the subject code, then display the subject name and a prompt to confirm enrolment_");
    };
  });
