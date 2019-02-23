var express     = require('express'),
	Campground  = require ('../models/campground'),
	Comment     = require ('../models/comment'),
	middleware	= require('../middleware');

const router = express.Router({mergeParams: true});

//====================
//COMMENT ROUTE
//====================
router.get('/new', middleware.isLoggedIn, (req, res)=>{
	//find id
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			res.render('comments/new', {campground: campground});
		}
	});
});

router.post('/', (req,res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			var commentvalue = req.body.comment;
			Comment.create(commentvalue, (err, comment)=>{
				if(err){
					console.log(err);
				}else{
					//add username and id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save(comment);
					console.log();
					req.flash('success','Successfully add a comment!');
					res.redirect('/campground/' + campground._id);
				}
			});
		}
	});
});

//edit
router.get('/:comment_id/edit', middleware.checkOwnerComment,(req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.render('back');
		}else{
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//update
router.put('/:comment_id', middleware.checkOwnerComment, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,(err, updateComment)=>{
		if (err) {
			res.send(err);
		}else{
			console.log('Updated Data = '+ updateComment);
			res.redirect('/campground/' + req.params.id);
		}
	});
});

//delete
router.delete('/:comment_id', middleware.checkOwnerComment, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if (err) {
			res.send(err);
		}else{
			res.redirect('/campground/'+ req.params.id);
		}
	});
});

module.exports = router;
