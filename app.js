const   methodOverride = require('method-override'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        flash = require('connect-flash'),
        mongoose = require("mongoose"),
        express = require("express"),
        app = express();
    
    
const   indexRoutes    = require("./routes/index"),
        storiesRoutes   = require("./routes/stories"),
        galleryRoutes = require("./routes/gallery"),
        contactRoutes = require("./routes/contacts"),
        aboutRoutes = require("./routes/abouts");

const DATABASEURL = process.env.DATABASEURL;

mongoose.connect(`mongodb://${DATABASEURL}`, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
        secret: "xcq120m85tj34qw7609thw73", // don't put this into your code at production.  Try using saving it into environment variable or a config file.
        resave: false,
        cookie: { expires: Date.now() + 3 * 24 * 3600 * 1000 },
        saveUninitialized: false
      }));
      
app.use(flash());


app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride('_method'))
    
app.use(function(req, res, next){
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});


app.use("/",indexRoutes);
app.use("/stories",storiesRoutes);
app.use("/gallery",galleryRoutes);
app.use("/contact-us",contactRoutes);
app.use("/about-us",aboutRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running!");
})