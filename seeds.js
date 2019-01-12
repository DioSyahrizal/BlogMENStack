var mongoose   = require('mongoose')
var Campground = require('./models/campground')
var Comment = require('./models/comment')

var data = [
	{
		name: 'Cloud Strife',
		image: 'https://i.ytimg.com/vi/a-Io_wokIuY/maxresdefault.jpg',
		description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam possimus nihil voluptatum quam fugiat debitis exercitationem magni laborum maiores iste delectus ipsa porro natus aperiam doloremque, quisquam mollitia. Voluptatum, aliquid!'
	},
	{
		name: 'Tifa Lockhart',
		image: 'https://i.ytimg.com/vi/cQruNODIjvA/maxresdefault.jpg',
		description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam possimus nihil voluptatum quam fugiat debitis exercitationem magni laborum maiores iste delectus ipsa porro natus aperiam doloremque, quisquam mollitia. Voluptatum, aliquid!'
	},
	{
		name: 'Squall Leonhart',
		image: 'https://i.ytimg.com/vi/KdsQl3Pja9o/maxresdefault.jpg',
		description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam possimus nihil voluptatum quam fugiat debitis exercitationem magni laborum maiores iste delectus ipsa porro natus aperiam doloremque, quisquam mollitia. Voluptatum, aliquid!'
	}
]

function deleteComment() {
	Comment.deleteMany({}, (err)=>{
		if (err) {
			console.log(err)
		}else{
			console.log('delete comment')
		}
	})
}

function seedDB(err) {
	deleteComment()
	Campground.deleteMany({}, function (err) {
		// if (err) {
		// 	console.log(err)
		// }
		// console.log('Remove all Campground')
		// //add campground
		// data.forEach(function (seed) {
		// 	Campground.create(seed, function (err, data) {
		// 		if (err) {
		// 			console.log(err)
		// 		} else {
		// 			console.log('added a campground')
		// 			//create comment
		// 			Comment.create({
		// 				text: 'This place is great, but i wish there was internet',
		// 				author: 'Homer'
		// 			},function (err, comment) {
		// 				if (err) {
		// 					console.log(err)
		// 				} else {
		// 					data.comments.push(comment)
		// 					data.save()
		// 					console.log('Create new comment')
		// 				}
		// 			})
		// 		}
		// 	})
		// })
	})

}

module.exports = seedDB
