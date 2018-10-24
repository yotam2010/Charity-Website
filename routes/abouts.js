var express = require("express"),
    router  = express.Router(),
    About = require("../modules/pic"),
    middleware = require("../middleware");

router.get("/about-us",function(req,res){
        About.find({},function(error,about){
        if(!error){
            res.render("about/index",{active:"about-us",admin:req.session.user,about});
        }else{
            req.flash("error_message","Couldnt load abous us page");
            res.redirect("/");
        }
    });
});


router.get("/about-us/new", middleware.isLoggedIn, function(req,res){
     res.render("about/new",{active:"",admin:req.session.user});
});

router.post("/about-us", middleware.isLoggedIn, function(req,res){
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

router.post("/about-us/delete/:id", middleware.isLoggedIn, function(req,res){
 
    About.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            res.json({result:"sucess"});
        }else{
            res.json({result:"failed"});
        }
    })
})


module.exports = router;