'use strict';

angular.module('studlyApp')
  .controller('ProfileCtrl', function ($scope, $http, Classes, Session, Subject, Timetable, User) {

        Classes.get(
            function (data) {
                console.log('Classes.get');
                console.log(data);
            },
            function (data) {
                console.log('Classes.get');
                console.log(data);
            }
        );
        Classes.save(
            function (data) {
                console.log('Classes.post');
                console.log(data);
            },
            function (data) {
                console.log('Classes.post');
                console.log(data);
            }
        );
        Classes.remove(
            function (data) {
                console.log('Classes.delete');
                console.log(data);
            },
            function (data) {
                console.log('Classes.delete');
                console.log(data);
            }
        );

        Session.get(
            function (data) {
                console.log('Session.get');
                console.log(data);
            },
            function (data) {
                console.log('Session.get');
                console.log(data);
            }
        );
        Session.save(
            function (data) {
                console.log('Session.post');
                console.log(data);
            },
            function (data) {
                console.log('Session.post');
                console.log(data);
            }
        );
        Session.remove(
            function (data) {
                console.log('Session.delete');
                console.log(data);
            },
            function (data) {
                console.log('Session.delete');
                console.log(data);
            }
        );
        Session.update(
            function (data) {
                console.log('Session.update');
                console.log(data);
            },
            function (data) {
                console.log('Session.update');
                console.log(data);
            }
        );

        Subject.get(
            function (data) {
                console.log('Subject.get');
                console.log(data);
            },
            function (data) {
                console.log('Subject.get');
                console.log(data);
            }
        );
        Subject.save(
            function (data) {
                console.log('Subject.post');
                console.log(data);
            },
            function (data) {
                console.log('Subject.post');
                console.log(data);
            }
        );
        Subject.remove(
            function (data) {
                console.log('Subject.delete');
                console.log(data);
            },
            function (data) {
                console.log('Subject.delete');
                console.log(data);
            }
        );

        Timetable.get(
            function (data) {
                console.log('Timetable.get');
                console.log(data);
            },
            function (data) {
                console.log('Timetable.get');
                console.log(data);
            }
        );
        Timetable.save(
            function (data) {
                console.log('Timetable.post');
                console.log(data);
            },
            function (data) {
                console.log('Timetable.post');
                console.log(data);
            }
        );
        Timetable.remove(
            function (data) {
                console.log('Timetable.delete');
                console.log(data);
            },
            function (data) {
                console.log('Timetable.delete');
                console.log(data);
            }
        );
        Timetable.update(
            function (data) {
                console.log('Timetable.update');
                console.log(data);
            },
            function (data) {
                console.log('Timetable.update');
                console.log(data);
            }
        );


        User.get(
            function (data) {
                console.log('User.get');
                console.log(data);
            },
            function (data) {
                console.log('User.get');
                console.log(data);
            }
        );
        User.save(
            function (data) {
                console.log('User.post');
                console.log(data);
            },
            function (data) {
                console.log('User.post');
                console.log(data);
            }
        );
        User.remove(
            function (data) {
                console.log('User.delete');
                console.log(data);
            },
            function (data) {
                console.log('User.delete');
                console.log(data);
            }
        );
        User.update(
            function (data) {
                console.log('User.update');
                console.log(data);
            },
            function (data) {
                console.log('User.update');
                console.log(data);
            }
        );
  });
