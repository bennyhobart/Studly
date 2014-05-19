module.exports = function(app, passport) {
  
  /* STANDARD ROUTING */
  app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
      res.sendfile('client/app/views/main.html');
    } else {
      res.sendfile('client/app/index.html');
    }
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post("/login", passport.authenticate('local', {
      successRedirect : "/",
      failureRedirect : "/",
      failureFlash: true
    })
  );

  /* API */
  
}