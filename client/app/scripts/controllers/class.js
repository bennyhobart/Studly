'use strict';

angular.module('studlyApp')
.controller('ClassCtrl', function ($scope) {

    //Dummy Data
    $scope.video = {
        slides: [],
        id: 1,
        download_url: 'video!!!!',
    };
    var slide = {
        image_url: 'placeholder_slide.png',
        id: 1,
        timestamp: 12000
    };
    $scope.threads = [];
    var thread = {
        user: 'jason-bourne69',
        title: 'What is.. I don\'t even?',
        count: {
            up: 50,
            against: 20
        },
        comments: [],
        body: 'So I was watching this video yeah, and He said this stuff about things I didn\'t understand...',
      };
    var comment = {
        user: 'xXDeAtHkIlLeRXx69',
        count: 20,
        body: 'you know what I don\'t even aswell, Don\'t even'
      };
    
    thread.comments.push(comment);
    $scope.threads.push(thread);
    $scope.threads.push(thread);
    $scope.video.slides.push(slide);
    $scope.video.slides.push(slide);
    $scope.video.slides.push(slide);
    $scope.video.slides.push(slide);

});
