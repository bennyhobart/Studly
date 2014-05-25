'use strict';


angular.module('studlyApp')
  .controller('TimetableCtrl', function ($scope, $location, Timetable) {


    /*Class.update({
      classId: '302030230203',
      attendedFlag: true 
    }).$promise.then(
    //success
    function (data) {

    },
    //failure
    function (data) {

    }
    );*/

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    Timetable.get().$promise.then(
    //success
    function (data) {
      consoe.log(data);
    },
    //failure
    function (data) {
      console.log(data);
    });
    Timetable.get({
      date: 'Date Object'
    }).$promise.then(
    //success
    function (data) {
      console.log(data);
    },
    //failure
    function (data) {
      console.log(data);
    });

    $scope.goToClass = function (classId) {
      $location.url('/class/' + classId);
    }

 		/*$scope.toggleCustom = function() {
            $scope.custom = $scope.custom === false ? true: false;
        };
    */

    /*http://javascript.about.com/library/blweekyear.htm*/
    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    }


    $scope.getWeekNumberStart = new Date().getWeek() - 10;

    $scope.previousWeek = function() {
      getWeekNumberStart--;
      console.log(getWeekNumberStart);
    }

    $scope.weekDay = new Date().getDay();

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

  var weekList = [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                  ];

  $scope.weekDays = weekList;


  $scope.getDayName = function() {
    var today = new Date().getDay();
    if ((today >= 1) && (today <= 5)) {
      return weekList[today-1];
    } else {
      return "Weekend";
    }
  }

  $scope.getDayNumber = function() {
    return new Date().getDay();
  }



  var curr = new Date; // get current date
  var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
  var last = first + 4; // last day is the first day + 6

  var firstDay = new Date(curr.setDate(first));
  var lastDay = new Date(curr.setDate(last));

  var monthList = [
                   "Jan",
                   "Feb",
                   "Mar",
                   "Apr",
                   "May",
                   "Jun",
                   "Jul",
                   "Aug",
                   "Sep",
                   "Oct",
                   "Nov",
                   "Dec"
                  ];

  $scope.firstDayOfWeek = firstDay.getDate() + " " + monthList[firstDay.getMonth()];
  $scope.lastDayOfWeek = lastDay.getDate() + " " + monthList[lastDay.getMonth()];


  var class1 = {
    id: 1,
    time: 915,
    end: 1100,
    day: 1,
    type: "Lecture",
    building: "Doug McDonell",
    theatre: "Steve Howard"
  };

  var class2 = {
    id: 1,
    time: 1400,
    end: 1600,
    day: 2,
    type: "Lecture",
    building: "Doug McDonell",
    theatre: "Denis Discroll"
  };

  var class3 = {
    id: 1,
    time: 1800,
    end: 1900,
    day: 1,
    type: "Lecture",
    building: "Alice Roy",
    theatre: "Room 227"
  };

  var class4 = {
    id: 1,
    time: 1800,
    end: 1900,
    day: 3,
    type: "Tutorial",
    building: "Alice Roy",
    theatre: "Room 227"
  };

  var class5 = {
    id: 1,
    time: 1800,
    end: 1900,
    day: 5,
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
    classes: [class3, class5]
 	};

  $scope.subjects = [AI, COMPLEX, WEB];

  });
