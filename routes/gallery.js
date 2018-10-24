var express = require("express"),
    router  = express.Router(),
    Picture = require("../modules/pic"),
    middleware = require("../middleware");
    
router.get("/gallery",function(req,res){
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

router.get("/gallery/new", middleware.isLoggedIn, function(req,res){
    res.render("gallery/new",{active:"",admin:req.session.user});
})

router.post("/gallery", middleware.isLoggedIn, function(req,res){
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

router.post("/gallery/delete/:id", middleware.isLoggedIn, function(req,res){
    Picture.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            res.json({result:"sucess"});
        }else{
            res.json({result:"failed"});
        }
    })
})

module.exports = router;