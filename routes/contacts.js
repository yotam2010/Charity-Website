var express = require("express"),
    router  = express.Router(),
    Contact = require("../modules/contact"),
    nodemailer = require('nodemailer'),
    middleware = require("../middleware");
    
const GMAIL_PASS = process.env.GMAIL_PASSWORD;
const GMAIL_USER = process.env.GMAIL_USER;
    
    
router.get("/",function(req,res){
    Contact.find({},(error,branches)=>{
        if(!error){
            res.render("contact/index",{active:"contact-us",admin:req.session.user,branches});
        }else{
            req.flash("error_message","Couldnt load contact us page");
            res.redirect("/");
        }
    })
})

router.post("/email",function(req,res){
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


router.get("/new", middleware.isLoggedIn, function(req,res){
     res.render("contact/new",{active:"",admin:req.session.user});
});

router.post("/", middleware.isLoggedIn, function(req,res){
    var {branch,info,tel} = req.body;
    var newContact = {branch:branch, info:info, tel:tel};
    Contact.create(newContact,function(error,about){
        if(!error){
            res.redirect("/contact-us");
        }else{
            req.flash("error_message","Failed to create new contact");
            res.redirect("/contact-us/new");
        }
    });
});

router.post("/delete/:id", middleware.isLoggedIn, function(req,res){
 
    Contact.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            res.json({result:"sucess"});
        }else{
            res.json({result:"failed"});
        }
    })
})


module.exports = router;