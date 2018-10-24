var express = require("express"),
    router  = express.Router(),
    Story = require("../modules/story"),
    middleware = require("../middleware");

router.get("/stories",function(req,res){
    Story.find({},(error,data) => {
        res.render("stories/index",{active:"stories",admin:req.session.user,stories:data});
    });
});

router.get("/stories/new",middleware.isLoggedIn ,function(req,res){
    res.render("stories/new",{active:"",admin:req.session.user});
})

router.post("/stories",middleware.isLoggedIn ,function(req,res){
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

router.delete("/stories/:id",middleware.isLoggedIn ,function(req,res){
    Story.findByIdAndDelete(req.params.id,function(error,data){
       if(!error){
            req.flash("success_message","Story deleted")
            res.redirect("/stories");
        }else{req.flash("success_message","Failed deleting the story")
            res.redirect("/stories");
        }
    })
})


module.exports = router;