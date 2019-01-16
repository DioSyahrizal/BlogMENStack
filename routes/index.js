var express     = require('express'),
	User        = require('../models/user'),
	passport    = require('passport');

const router = express.Router();

router.get('/', function (req, res) {
	res.render('landing');
});


//AUTH ROUTE

//REGISTER
router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, ()=>{
			console.log(user);
			res.redirect('/campground');
		});
	});
});

//LOGIN
router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/campground',
	failureRedirect: '/login'
}),() => {});

//LOGOUT
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/campground');
});

module.exports = router;
