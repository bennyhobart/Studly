'use strict';

angular.module('studlyApp')
.controller('SubjectCtrl', function ($scope, $rootScope, Subject) {
	var subjectID;
	var toJoinClasses = [];

	$scope.subjectName = "Placeholder";

	$scope.days = ['Monday', 'Tuesday', 'Wednesday',
		'Thursday', 'Friday', 'Saturday', 'Sunday'];

	$scope.init = function () {
		subjectID = $rootScope.manageID;
		Subject.getData({id: subjectID}).
			$promise.then(function (data) {
				// Success
	                console.log(data);
	                $scope.subjectName = data.subjectName;
	                $scope.subjectCode = data.subjectCode;
	                $scope.semesterID = data.semesterID;
				    $scope.classList = data.class;
				    // angular.forEach($scope.classList, function(index) {
				    // 	return index.classTimes;
				    // }, $scope.classTimes);
	            }, function (data) {
	            // Failure
	                console.log(data);
	        	}
	        );
	}

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

	$scope.enrol = function () {
		Subject.save({
			subjectID: subjectID,
			classTimes: toJoinClasses
		}).$promise.then(function (data) {
            console.log(data);
        }, function (data) {
            console.log(data);
        });
	}

	$scope.withdraw = function () {
		Subject.withdraw({
			subjectID: subjectID
		}).$promise.then(function (data) {
            console.log(data);
        }, function (data) {
            console.log(data);
        });
	}

	$scope.addClass = function (classInstance) {
		toJoinClasses.push(classInstance);
	}

	$scope.clearClasses = function (classInstance) {
		toJoinClasses = [];
	}
});
