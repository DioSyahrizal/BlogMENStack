var express    = require('express'),
	Campground = require('../models/campground');

const router  = express.Router();

router.get('/', function (req, res) {
	Campground.find({}, function (err, allCampground) {
		if (err) {
			console.log(err);
		}else{
			console.log(req.user);
			res.render('campgrounds/index', {campground: allCampground});
		}
	});
});

//CREATE
router.post('/', isLoggedIn, (req, res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = {name: name, image:image, description:description, author:author};
	Campground.create(newCamp, function (err, campground) {
		if (err) {
			console.log(err);
		}else{
			console.log('Insert Success');
			console.log(campground);
			res.redirect('/campground');
		}
	});

});

//NEW PAGE TO CREATE
router.get('/new', isLoggedIn, function (req, res) {
	res.render('campgrounds/new.ejs');
});

//SHOW
router.get('/:id', function (req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
		if (err) {
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render('campgrounds/show',{campground: foundCampground});
		}
	});
});

//EDIT FORM
router.get('/:id/edit', (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if (err) {
			res.redirect('/campground');
		}else{
			res.render('campgrounds/edit',{campground: foundCampground});
		}
	});

});

//UPDATE
router.put('/:id', (req,res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if (err) {
			res.redirect('/campground');
		} else{
			console.log('Updated Data = '+ updatedCampground);
			res.redirect('/campground/'+ req.params.id);
		}
	});
});

//DELETE
router.delete('/:id', (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect('/campground');
		}else{
			res.redirect('/campground');
		}
	});
});
//MIDDLEWARE
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}


module.exports = router;