const   methodOverride = require('method-override'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        flash = require('connect-flash'),
        mongoose = require("mongoose"),
        express = require("express"),
        bcrypt = require('bcrypt'),
        app = express();
    
const   User    = require("./modules/user"),
        Story   = require("./modules/story"),
        Picture = require("./modules/pic"),
        Contact = require("./modules/contact"),
        About = require("./modules/about");
    
const   globalRoutes    = require("./routes/global"),
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

app.get("/",function(req,res){
    res.render("index",{active:"home",admin:req.session.user});
});



app.get("/donations",function(req,res){
    res.render("donations",{active:"donations",admin:req.session.user});
})


app.get("/login",function(req,res){
    res.render("login",{active:"",admin:req.session.user});
})


      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
app.post('/signup', (req, res) => {
  let {username, password} = req.body;
    let userData = {
    	username:username,
        password: bcrypt.hashSync(password, 5) // we are using bcrypt to hash our password before saving it to the database
    };

    let newUser = new User(userData);
    User.create(newUser,(error,data) => {
    	if (!error) {
        	return res.status(201).json('signup successful')
        } else {
        	if (error.code ===  11000) { // this error gets thrown only if similar user record already exist.
            	return res.status(409).send('user already exist!')
            } else {
            	console.log(error); // you might want to do this to examine and trace where the problem is emanating from
            	return res.status(500).send('error signing up user')
            }
        }
    });
})
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION


app.post('/login', (req, res) => {
  let {username, password} = req.body;
    User.findOne({username: username}, 'username password', (err, userData) => {
    	if (!err && userData) {
    	    console.log(userData);
        	let passwordCheck = bcrypt.compareSync(password, userData.password);
        	if (passwordCheck) { // we are using bcrypt to check the password hash from db against the supplied password by user
                req.session.user = {
                  username: userData.username
                }; // saving some user's data into user's session
                req.session.user.expires = new Date(
                  Date.now() + 3 * 24 * 3600 * 1000 // session expires in 3 days
                );
                req.flash("success_message","Logged in!")
                res.redirect("/");
            } else {
                req.flash("error_message","incorrect password")
                res.redirect("/login");
            }
        } else {
            req.flash("error_message","invalid login credentials")
            res.redirect("/login");
        }
    })
})

app.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("error_message","Authrization failed! Please login")
    res.redirect("/login");
  }
});

app.get('/logout', (req, res) => {
  	req.session.user=false;
  	req.flash("success_message","Signed out")
    res.redirect("/");
})




app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running!");
})