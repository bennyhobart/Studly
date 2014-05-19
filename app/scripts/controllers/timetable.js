'use strict';


angular.module('studlyApp')
  .controller('TimetableCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

 		$scope.toggleCustom = function() {
            $scope.custom = $scope.custom === false ? true: false;
        };


    var focusDay  = new Date();
    var numberOfDays = 60;

    $scope.dates = [];

 	for (var i = 0; i < numberOfDays; i++) {

 		$scope.dates.push(new Date(focusDay));
 		focusDay.setDate(focusDay.getDate()+1);
 	}


    $scope.checkDayType = function(date) {
 		if ((date.getDate() == (new Date()).getDate()) && (date.getDay() == (new Date()).getDay())) {
 			return "today";
 		} else if (date.getDay() == 0) {
 			return "weekend";
 		}
 		
 		return "day";
    };

    $scope.formatTime = function(time) {

    	var hour;
    	if (time.toString().length > 3) {
			hour = time.toString().substr(0,2);
		} else {
			hour = time.toString().substr(0,1);
		}

		var amPM;
 		if ((time - 1200 > 0)) {
 			time = time - 1200;
 			amPM = " PM";
 		} else {
 			amPM = " AM";
 		}
 		
 		return hour + ":" + time.toString().slice(-2);
    };

    var class1 = {
    time: 915,
    end: 1100,
    day: 1,
    type: "Lecture",
    building: "Doug McDonell",
    theatre: "Steve Howard"
  };

  $scope.formatDay = function(day) {
    if (day == 1) {
      return "Mon";
    } else if (day == 2) {
      return "Tue";
    } else if (day == 3) {
      return "Wed";
    } else if (day == 4) {
      return "Thu";
    } else if (day == 5) {
      return "Fri";
    }
  }

  var class2 = {
    time: 1400,
    end: 1600,
    day: 2,
    type: "Lecture",
    building: "Doug McDonell",
    theatre: "Denis Discroll"
  };

  var class3 = {
    time: 1800,
    end: 1900,
    day: 1,
    type: "Lecture",
    building: "Alice Roy",
    theatre: "Room 227"
  };

  var class4 = {
    time: 1800,
    end: 1900,
    day: 3,
    type: "Tutorial",
    building: "Alice Roy",
    theatre: "Room 227"
  };

 	var AI = {
 		name: "Artificial Inteligence",
 		code: "COMP30050",
    color: "blue-light",
    classes: [class1, class4]
 	};

 	var COMPLEX = {
 		name: "Modelling Complex Software Systems",
 		code: "COMP40001",
    color: "orange",
    classes: [class2]
 	};

 	var WEB = {
 		name: "Web Information Technologies",
 		code: "INFO30005",
    color: "blue-light",
    classes: [class3]
 	};

  $scope.subjects = [AI, COMPLEX, WEB];

  });
