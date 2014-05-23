angular.module('Socket', ['btford.socket-io'])
    .factory('Socket', ['', function(socketFactory){
        return socketFactory();
    }])