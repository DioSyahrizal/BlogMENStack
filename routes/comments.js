var express     = require('express'),
	Campground  = require ('../models/campground'),
	Comment     = require ('../models/comment')

const router = express.Router({mergeParams: true})

//====================
//COMMENT ROUTE
//====================
router.get('/new', isLoggedIn, (req, res)=>{
	//find id
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err)
		}else{
			res.render('comments/new', {campground: campground})
		}
	})
})

router.post('/', (req,res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err)
		}else{
			var commentvalue = req.body.comment
			Comment.create(commentvalue, (err, comment)=>{
				if(err){
					console.log(err)
				}else{
					campground.comments.push(comment)
					campground.save()
					res.redirect('/campground/' + campground._id)
				}
			})
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
