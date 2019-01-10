var express         = require('express'),
	app             = express(),
	bodyparser      = require('body-parser'),
	mongoose        = require('mongoose'),
	passport        = require('passport'),
	LocalStrategy   = require('passport-local'),
	User            = require('./models/user'),
	seedDB          = require('./seeds'),
	PORT            = process.env.PORT || 3000

var commentRoutes   = require('./routes/comments'),
	campgroundRoutes= require('./routes/campgrounds'),
	indexRoutes     = require('./routes/index')

mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost:27017/yelp_campv4', { useNewUrlParser: true })

app.use(bodyparser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
seedDB()

//PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'Lala Satalin',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
})

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//init route
app.use(indexRoutes)
app.use('/campground',campgroundRoutes)
app.use('/campground/:id/comments',commentRoutes)

app.listen(PORT, function () {
	console.log('Server started in port 3000')
})