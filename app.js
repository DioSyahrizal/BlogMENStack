var express         = require('express'),
    app             = express(),
    bodyparser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require('passport-local'),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    PORT            = process.env.PORT || 3000

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/yelp_campv4", { useNewUrlParser: true });

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Lala Satalin",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campground", function (req, res) {
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        }else{
            console.log(req.user);
            res.render("campgrounds/index", {campground: allCampground});
        }
    });

});

//CREATE
app.post("/campground", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name: name, image:image, description:description};
    Campground.create(newCamp, function (err, campground) {
        if (err) {
            console.log(err);
        }else{
            console.log("Insert Success");
            console.log(campground);
        }
    })
    res.redirect("/campground");
});

//NEW PAGE TO CREATE
app.get("/campground/new", function (req, res) {
    res.render("campgrounds/new.ejs");
});

//SHOW
app.get("/campground/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground})
        }
    });
});

//====================
//COMMENT ROUTE
//====================
app.get("/campground/:id/comments/new", isLoggedIn, (req, res)=>{
    //find id
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
})

app.post("/campground/:id/comments", (req,res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err)
        }else{
            var commentvalue = req.body.comment;
            Comment.create(commentvalue, (err, comment)=>{
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});

//AUTH ROUTE

//REGISTER
app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/campground");
        });
    });
});

//LOGIN
app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}),(req, res) => {
});

//LOGOUT
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campground');
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

app.listen(PORT, function () {
    console.log("Server started in port 3000");
});