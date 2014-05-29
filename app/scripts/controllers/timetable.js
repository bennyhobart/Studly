'use strict';


angular.module('studlyApp')
  .controller('TimetableCtrl', function ($scope, $location, Timetable, Class) {


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

  $scope.goToClass = function (classId) {
    $location.url('/class/' + classId);
  };

  /*
  Function to get the day of week.
  Source: http://javascript.about.com/library/blweekyear.htm
  */
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

  $scope.thisWeekObject = new Date();

  $scope.firstDayOfWeek = function() {
    var first = new Date().getDate() - new Date().getDay() + (($scope.atualWeekDay - $scope.todayWeekDay)*7) + 1;
    var firstDay = new Date(new Date().setDate(first));
    return firstDay.getDate() + " " + monthList[firstDay.getMonth()];
  }

  $scope.lastDayOfWeek = function() {
    var last = new Date().getDate() - new Date().getDay() + (($scope.atualWeekDay - $scope.todayWeekDay)*7) + 5 ;
    var lastDay = new Date(new Date().setDate(last));
    return lastDay.getDate() + " " + monthList[lastDay.getMonth()];
  }

  $scope.loading = true;
  $scope.errorState = false;

  $scope.goPrev = function(){
      if ($scope.atualWeekDay > 1) {
        $scope.atualWeekDay -= 1;
        $scope.thisWeekObject = new Date($scope.thisWeekObject.setDate($scope.thisWeekObject.getDate()-7));
        $scope.updateSql();
      }
  }

  $scope.goNext = function(){
      if ($scope.atualWeekDay < 12) {
        $scope.atualWeekDay += 1;
        $scope.thisWeekObject = new Date($scope.thisWeekObject.setDate($scope.thisWeekObject.getDate()+7));
        $scope.updateSql();
      }
  }

  $scope.toggleMark = function(classId){
    Class.put({weeklyClassID: classId}, {
      attendedFlag: 1
    }).$promise.then(
    function (data) {
      console.log("success");
      console.log(data);
    },
    function (data) {
      console.log("errors");
    });
  }

  $scope.updateSql = function(){
    $scope.loading = true;
    Timetable.get({
      date: $scope.sqlQueryDate($scope.thisWeekObject)
    }).$promise.then(
    //success
    function (data) {
      $scope.subjs = data.subject;
      $scope.loading = false;
    },
    //failure
    function (data) {
      $scope.errorState = true;
    });
  }

  $scope.sqlQueryDate = function(date){
      return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  }

  $scope.updateSql();

  $scope.formatTime = function(time) {
  	var hour;
  	if (time.toString().length > 3) {
		 hour = time.toString().substr(0,2);
	  } else {
		 hour = time.toString().substr(0,1);
	  }
		
		 return hour + ":" + time.toString().slice(-2);
  };

  $scope.getPlainTime = function(time) {
    return time.replace(/:/g, '').substr(0,4);
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

  });
