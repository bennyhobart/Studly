'use strict';

angular.module('studlyApp')
.controller('ClassCtrl', ['$scope','$sce', function ($scope, $sce) {
    //Class Information
    $scope.classInfo = {
        name: 'Web Information Technologies',
        subjectCode: 'INFO30005',
        weeklyClasses: [{
            Lecture: [],
            Tutorials: [],

        }]
    }
    //Dummy Data
    $scope.video = {
        date: 'Friday, March 12',
        slides: [],
        id: 1,
        url: $sce.trustAsResourceUrl('http://tinyurl.com/2014-04-14'),
    };
    var slide = {
        imageUrl: 'images/placeholder_slide.png',
        id: 1,
        timestamp: 12000
    };
    $scope.threads = [];
    var thread = {
        user: 'jason-bourne69',
        title: 'What is.. I don\'t even?',
        count: {
            up: 50,
            down: 20
        },
        timestamp: '5:30pm, March 15',
        comments: [],
        body: 'So I was watching this video yeah, and He said this stuff about things I didn\'t understand...',
        id: 0
    };
    var comment = {
        user: 'xXDeAtHkIlLeRXx69',
        timestamp: '5:35pm, March 15',
        body: 'you know what I don\'t even aswell, Don\'t even',
        id: 0
    };
    for(var i=0; i<10; ++i) {
        var a = angular.copy(comment);
        a.id=i;
        thread.comments.push(a);
    }
    for(var i=0; i<10; ++i) {
        var a = angular.copy(slide);
        a.id=i;
        $scope.video.slides.push(a);
    }
    for(i=0;i<10;++i) {
        var a = angular.copy(thread);
        a.id=i;
        $scope.threads.push(a);
    }

    // //Actual code
    // //scroll video withpage
    // var video = $('#video');
    // var offset = video.offset();
    // $(window).scroll(function() {
    //     var width = video.width();
    //     var parentWidth = video.parent().width();
    //     if(width/parentWidth===1){
    //         return;
    //     }

    //     if ($(window).scrollTop() > offset.top-20) {
    //         video.stop().animate({
    //             marginTop: ($(window).scrollTop()+20-offset.top)
    //         }, 0);
    //     } else {
    //         video.stop().animate({
    //             marginTop: 0
    //         }, 0);
    //     }
    // });



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

    $scope.upvote = function(obj) {
        obj.count.up+=1;
    };
    $scope.downvote = function(obj) {
        obj.count.down+=1;
    };

    $scope.openComments = function(thread) {
        $scope.thread = thread;
        $('#modal').modal('show');

    };




}]);
