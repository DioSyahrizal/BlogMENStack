var Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middlewareObj = {};

middlewareObj.checkOwnerCamp = (req, res, next)=>{
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground)=>{
			if (err) {
				res.redirect('back');
			}else{
				//own campground?
				var id = foundCampground.author.id;
				if (id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	}else{
		res.redirect('back');
	}
};

middlewareObj.checkOwnerComment = (req, res, next)=>{
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if (err) {
				res.redirect('back');
			}else{
				//own campground?
				var id = foundComment.author.id;
				var userid = req.user._id;
				if (id.equals(userid)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	}else{
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = (req, res, next)=>{
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};



module.exports = middlewareObj;