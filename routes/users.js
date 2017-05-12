var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

var User = require('../models/user')

// Register route
router.get('/register', function(req, res){
	res.render('register');
});

// Login route
router.get('/login', function(req, res){
	res.render('login');
});

//Authenticated user file upload routes
router.get('/virtue', function(req, res){
	res.render('virtue');
});

//upload virtue route
router.post('/virtue', upload.any(), function(req, res) {
	res.render('thxup');
});

//after file upload route to thank you page.
router.get('/thxup', function(req, res){
	res.render('thxup');
});

// Register user
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

//validations..
req.checkBody('name','Name is required').notEmpty();
req.checkBody('email', 'Email is required').notEmpty();
req.checkBody('email', 'Email is not valid').isEmail();
req.checkBody('username', 'Username is required').notEmpty();
req.checkBody('password', 'Password is required').notEmpty();
req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

var errors = req.validationErrors();

		if(errors) {
			res.render('register' ,{
				errors:errors
			});
		} else {
			var newUser = new User({
				name: name,
				email: email,
				username: username,
				password: password
			});

			User.createUser(newUser,function(err,user){
				if(err) throw err;
				console.log(user);
			});

			req.flash('success_msg','You are now registered, Please Login');

			res.redirect('/users/login');
		}
});
router.post('/virtue',function(req, res){
    var name = req.body.name;
    var start = req.body.startdate;
    var end = req.body.enddate;
    var desc = req.body.projectinfo;

//validations
req.checkBody('name','Name is required').notEmpty();
req.checkBody('startdate','start date is required').notEmpty();
req.checkBody('enddate','End date is required').notEmpty();
req.checkBody('projectinfo','Project Description is required').notEmpty();

    var errors = req.validationErrors();

        if(errors) {
            res.render('virtue', {
                errors:errors
            });
        } else {
            var newProject = new Project({
                name: name,
                start: startdate,
                end: enddate,
                desc: projetinfo
            });

            Project.createProject(newProject, function(err,user){
                if(err) throw err;
                console.log(user);
            });

            req.flash('success_msg','Your Project was submitted successfully');

            res.redirect('/users/thxup');
        }
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown User'});
			}
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
  }));

passport.serializeUser(function(user, done) {
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect:'/users/virtue',failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
		 res.redirect('/users/virtue');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
	});

module.exports = router;
