'use strict';


angular.module('studlyApp')
  .controller('TimetableCtrl', function ($scope, $location, Timetable) {


    /*Class.update({
      classId: '302030230203',
      attendedFlag: true 
    }).$promise.then(
    //success
    function (data) {
      consoe.log(data);
    },
    //failure
    function (data) {
      consoe.log(data);
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
      console.log(data);
    },
    //failure
    function (data) {
      console.log('Error getting data 1.');
    });

    Timetable.get({
      date: '2014-08-28'
    }).$promise.then(
    //success
    function (data) {
      console.log(data);
    },
    //failure
    function (data) {
      console.log('Error getting data 2.');
    });

    $scope.goToClass = function (classId) {
      $location.url('/class/' + classId);
    };

 		/*
      $scope.toggleCustom = function() {
            $scope.custom = $scope.custom === false ? true: false;
      };
    */

    /*http://javascript.about.com/library/blweekyear.htm*/
    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    };

    $scope.todayWeekDay = new Date().getWeek() - 10;
    $scope.atualWeekDay = new Date().getWeek() - 10;

    $scope.getDayNumber = function() {
      return new Date().getDay();
    }

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

    $scope.firstDayOfWeek = function(week) {
      var first = new Date().getDate() - new Date().getDay() + 1 + (($scope.atualWeekDay - $scope.todayWeekDay)*7); // First day is the day of the month - the day of the week
      var firstDay = new Date(new Date().setDate(first));
      return firstDay.getDate() + " " + monthList[firstDay.getMonth()];
    }

    $scope.lastDayOfWeek = function(week) {
      var first = new Date().getDate() - new Date().getDay() + 5 + (($scope.atualWeekDay - $scope.todayWeekDay)*7); // First day is the day of the month - the day of the week
      var firstDay = new Date(new Date().setDate(first));
      return firstDay.getDate() + " " + monthList[firstDay.getMonth()];
    }

    $scope.goPrev = function(){
        if ($scope.atualWeekDay > 1) {
          $scope.atualWeekDay -= 1;
        }
    }

    $scope.goNext = function(){
        if ($scope.atualWeekDay < 12) {
          $scope.atualWeekDay += 1;
        }
    }

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

  var class1 = {
    id: 1,
    time: 915,
    end: 1100,
    day: 1,
    type: "Lecture",
    building: "Doug McDonell",
    theatre: "Steve Howard",
    marked: false
  };

  var class2 = {
    id: 2,
    time: 1400,
    end: 1600,
    day: 2,
    type: "Lecture",
    building: "Doug McDonell",
    theatre: "Denis Discroll",
    marked: false
  };

  var class3 = {
    id: 3,
    time: 1800,
    end: 1900,
    day: 1,
    type: "Lecture",
    building: "Alice Roy",
    theatre: "Room 227",
    marked: false
  };

  var class4 = {
    id: 4,
    time: 1800,
    end: 1900,
    day: 3,
    type: "Tutorial",
    building: "Alice Roy",
    theatre: "Room 227",
    marked: true
  };

  var class5 = {
    id: 5,
    time: 1800,
    end: 1900,
    day: 5,
    type: "Tutorial",
    building: "Alice Roy",
    theatre: "Room 227",
    marked: false
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

  $scope.allclasses = [class1, class2, class3, class4, class5];

  $scope.toggleMark = function(classId) {
    for (var i = 0; i < $scope.allclasses.length; i++) {
      if ($scope.allclasses[i].id == classId) {
        if ($scope.allclasses[i].marked) {
          $scope.allclasses[i].marked = false;
        } else {
          $scope.allclasses[i].marked = true;
        }
      }
    }
  }

  });
