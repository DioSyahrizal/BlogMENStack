var express     = require('express'),
    app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
    PORT        = process.env.PORT || 3000

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/yelp_campv4", { useNewUrlParser: true });

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campground", function (req, res) {
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        }else{
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
app.get("/campground/:id/comments/new", (req, res)=>{
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

app.listen(PORT, function () {
    console.log("Server started in port 3000");
});