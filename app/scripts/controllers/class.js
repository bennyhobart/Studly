'use strict';

angular.module('studlyApp')
.controller('ClassCtrl', ['Class', '$scope','$sce', '$rootScope', '$location', function (Class, $scope, $sce, $rootScope, $location) {
    var weeklyClassId;
    $scope.init = function () {
        weeklyClassId = $rootScope.weeklyClassId;
        if(!weeklyClassId) {
            $location.path('/timetable');
        }
        Class.get({weeklyClassId: weeklyClassId}).
            $promise.then(function (data) {
                console.log(data);
                $scope.threads = data.threads;
                $scope.classInfo = data.classInfo;
            }, function (data) {
                console.log(data);
            });

        // //Dummy Data
        $scope.video = {
            date: 'Friday, March 12',
            slides: [],
            id: 1,
            url: $sce.trustAsResourceUrl('http://tinyurl.com/2014-04-14'),
        };
    }





    $scope.displayTime = function (time) {
        return moment(time).fromNow();
    }

    var currentSlide = 0;
    var updateSlides = function() {
        $scope.slides=_.range(currentSlide, currentSlide+4);
    };
    updateSlides();
    $scope.nextSlide = function() {
        if(currentSlide+4<$scope.video.slides.length) {
            currentSlide += 1;
            updateSlides();
        }
        return;
    };
    $scope.prevSlide = function() {
        if(currentSlide!==0) {
            currentSlide -= 1;
            updateSlides();
        }
        return;
    };

    $scope.upvote = function(thread) {
        Class.update({
            vote: 1,
            weeklyClassId: weeklyClassId,
            topicId: thread.topicID
        }).$promise.then(function (data) {
            console.log(data);
        }, function (data) {
            console.log(data);
        });
    };
    $scope.deleteVote = function (thread) {
        Class.update({
            vote: 1,
            weeklyClassId: weeklyClassId,
            topicId: thread.topicID
        }).$promise.then(function (data) {
            console.log(data);
        }, function (data) {
            console.log(data);
        });
    }
    $scope.downvote = function(thread) {
        Class.update({
            vote: 1,
            weeklyClassId: weeklyClassId,
            topicId: thread.topicID
        }).$promise.then(function (data) {
            console.log(data);
        }, function (data) {
            console.log(data);
        });
    };
    $scope.addThread = function (data) {
        Class.save({
            weeklyClassId: weeklyClassId,
            title: $scope.title,
            body: $scope.body
        }).$promise.then(function (data) {
            $scope.init();
        }, function (data) {
        });
    };
    $scope.openComments = function(thread) {
        $scope.thread = thread;
        Class.query({
            weeklyClassId: weeklyClassId,
            topicId: thread.topicID
        }).$promise.then(function (data) {
            $scope.thread.comments = data;
        }, function (data) {
        });
        $('#modal').modal('show');

    };
    $scope.addComment = function() {
        Class.save({
            weeklyClassId: weeklyClassId,
            topicId: $scope.thread.topicID,
            content: $scope.comment
        }).$promise.then(function (data) {
            $scope.openComments($scope.thread);
        }, function (data) {
        });
    }




}]);
