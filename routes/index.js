var express = require("express"),
    router  = express.Router(),
    User = require("../modules/user"),
    bcrypt = require('bcrypt');
    
    
router.get("/",function(req,res){
    res.render("index",{active:"home",admin:req.session.user});
});



router.get("/donations",function(req,res){
    res.render("donations",{active:"donations",admin:req.session.user});
})


router.get("/login",function(req,res){
    res.render("login",{active:"",admin:req.session.user});
})


      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
      // DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTION DELETE BEFORE PRODUCTIONDELETE BEFORE PRODUCTION
router.post('/signup', (req, res) => {
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

      
router.post('/login', (req, res) => {
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

router.get('/logout', (req, res) => {
  	req.session.user=false;
  	req.flash("success_message","Signed out")
    res.redirect("/");
})


module.exports = router;