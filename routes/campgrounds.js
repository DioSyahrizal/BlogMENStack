var express    = require('express'),
	Campground = require('../models/campground')

const router  = express.Router()

router.get('/', function (req, res) {
	Campground.find({}, function (err, allCampground) {
		if (err) {
			console.log(err)
		}else{
			console.log(req.user)
			res.render('campgrounds/index', {campground: allCampground})
		}
	})
})

//CREATE
router.post('/', isLoggedIn, function (req, res) {
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name: name, image:image, description:description, author:author}
	Campground.create(newCamp, function (err, campground) {
		if (err) {
			console.log(err)
		}else{
			console.log('Insert Success')
			console.log(campground)
			res.redirect('/campground')
		}
	})

})

//NEW PAGE TO CREATE
router.get('/new', isLoggedIn, function (req, res) {
	res.render('campgrounds/new.ejs')
})

//SHOW
router.get('/:id', function (req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
		if (err) {
			console.log(err)
		}else{
			console.log(foundCampground)
			res.render('campgrounds/show',{campground: foundCampground})
		}
	})
})

//MIDDLEWARE
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}


module.exports = router