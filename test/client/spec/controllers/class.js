'use strict';

describe('Controller: ClassCtrl', function () {

  // load the controller's module
  beforeEach(module('studlyApp'));

  var ClassCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClassCtrl = $controller('ClassCtrl', {
      $scope: scope
    });
  }));

});
