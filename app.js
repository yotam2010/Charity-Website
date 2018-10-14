var express = require("express"),
    bodyParser = require("body-parser"),
    app = express();
    
app.set("view engine","ejs");
console.log(__dirname+"/public");
app.use(express.static(__dirname+"/public"));
    
app.get("/",function(req,res){
   res.render("index",{active:"home"}); 
});

app.get("/stories",function(req,res){
    res.render("stories",{active:"stories"});
})

app.get("/gallery",function(req,res){
    res.render("gallery",{active:"gallery"});
})

app.get("/about-us",function(req,res){
    res.render("about-us",{active:"about-us"});
})

app.get("/contact-us",function(req,res){
    res.render("contact-us",{active:"contact-us"});
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running!");
})