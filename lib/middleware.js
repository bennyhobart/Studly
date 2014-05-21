'use strict';

/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send(401);
  },

  /**
   * Set a cookie for angular so it knows we have a http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user));
    }
    next();
  }
};