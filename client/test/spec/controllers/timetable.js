'use strict';

describe('Controller: TimetableCtrl', function () {

  // load the controller's module
  beforeEach(module('studlyApp'));

  var TimetableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimetableCtrl = $controller('TimetableCtrl', {
      $scope: scope
    });
  }));

});
