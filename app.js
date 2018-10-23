const   methodOverride = require('method-override'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        nodemailer = require('nodemailer'),
        flash = require('connect-flash'),
        mongoose = require("mongoose"),
        express = require("express"),
        bcrypt = require('bcrypt'),
        app = express();
    
const User    = require("./modules/user"),
    Story   = require("./modules/story"),
    Picture = require("./modules/pic"),
    About = require("./modules/about");
    
const GMAIL_PASS = process.env.GMAIL_PASSWORD;
const GMAIL_USER = process.env.GMAIL_USER;
    
    
mongoose.connect('mongodb://localhost/anneni', { useNewUrlParser: true });

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
    // About.create(
    //     {title:"Who are we",
    //     content:"We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ..."});
    // About.create(
    //     {title:"Our Vision",
    //     content:"We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ..."});
    // About.create(
    //     {title:"How we try to achieve it",
    //     content:"We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ..."});
    // About.create(
    //     {title:"How YOU can help",
    //     content:"We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ...We are dedicated to help those in needs beliving everyone deserve education, food and medial treatment. Together we can ..."});

    res.render("index",{active:"home",admin:req.session.user});
});

app.get("/stories",function(req,res){
    Story.find({},(error,data) => {
        res.render("stories/index",{active:"stories",admin:req.session.user,stories:data});
    });
});

app.get("/gallery",function(req,res){
    Picture.find({}).sort('event').exec(function(error,data){
        
        var events = []; var index=0;
        if(data.length>0){
            events[0]=[];
        }
        data.forEach(function(pic,i,arr){
            if(i>0 && data[i-1].event!=pic.event){
                index++;
                events[index]=[];
            }
            events[index].push(pic);
        })

        res.render("gallery/index",{active:"gallery",admin:req.session.user,events});
    });
});

app.get("/about-us",function(req,res){
        About.find({},function(error,about){
        if(!error){
            res.render("about/index",{active:"about-us",admin:req.session.user,about});
        }else{
            req.flash("error_message","Failed to get to the edit page");
            res.redirect("/about-us");
        }
    });
});

app.get("/donations",function(req,res){
    res.render("donations",{active:"donations",admin:req.session.user});
})

app.get("/contact-us",function(req,res){
    res.render("contact-us",{active:"contact-us",admin:req.session.user});
})

app.post("/contact-us",function(req,res){
    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: GMAIL_USER,
    subject: 'WEB-AUTO: New message from '+`${req.body.name} (${req.body.email})`,
    text: `${req.body.name} (${req.body.email}) says: ${req.body.content}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
        console.log(error);
        req.flash("error_message","Failed to send contact form");
        res.redirect('/contact-us');
    }
    else {
        req.flash("success_message","We will be in touch soon!");
        res.redirect('/contact-us');
    }
  });
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

app.get("/stories/new",function(req,res){
    res.render("stories/new",{active:"",admin:req.session.user});
})

app.post("/stories",function(req,res){
    let {picture,title,content} = req.body;
    let storyData = {picture,title,content};
    Story.create(storyData,(error,story) => {
        if(!error){
            req.flash("success_message","Story added")
            res.redirect("/stories");
        }else{req.flash("error_message","Failed to add story")
            res.redirect("/stories/new");
        }
    })
})

app.delete("/stories/:id",function(req,res){
    Story.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            req.flash("success_message","Story deleted")
            res.redirect("/stories");
        }else{req.flash("success_message","Failed deleting the story")
            res.redirect("/stories");
        }
    })
})

app.get("/gallery/new",function(req,res){
    res.render("gallery/new",{active:"",admin:req.session.user});
})

app.post("/gallery",function(req,res){
    let {url,event} = req.body;
    let picData = {url,event};
    Picture.create(picData,(error,picture) => {
        if(!error){
            req.flash("success_message","Picture added")
            res.redirect("/gallery");
        }else{req.flash("error_message","Failed to add picture")
            res.redirect("/gallery/new");
        }
    })
})

app.post("/gallery/delete/:id",function(req,res){
    Picture.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            res.json({result:"sucess"});
        }else{
            res.json({result:"failed"});
        }
    })
})

app.get("/about-us/new",function(req,res){
     res.render("about/new",{active:"",admin:req.session.user});
});

app.post("/about-us",function(req,res){
    var {title,content} = req.body;
    var newAbout = {title:title,content:content};
    About.create(newAbout,function(error,about){
        if(!error){
            res.redirect("/about-us");
        }else{
            req.flash("error_message","Failed to create about");
            res.redirect("/about-us/new");
        }
    });
});

app.post("/about-us/delete/:id",function(req,res){
 
    About.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            res.json({result:"sucess"});
        }else{
            res.json({result:"failed"});
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running!");
})