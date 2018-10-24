

module.exports = {
    
    isLoggedIn: function(req, res, next){
    if (req.session.user) {
        next();
    } else {
        req.flash("error_message","Authrization failed! Please login")
        res.redirect("/login");
    }}
    
    
}