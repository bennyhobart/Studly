'use strict';

describe('Service: classes', function () {

  // load the service's module
  beforeEach(module('studlyApp'));

  // instantiate service
  var classes;
  beforeEach(inject(function (_classes_) {
    classes = _classes_;
  }));

  it('should do something', function () {
    expect(!!classes).toBe(true);
  });

});
