var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    branch:{type:String, required:true},
    info:{type:String, required:true},
    tel:{type:Number}
});

module.exports = mongoose.model("Contact",contactSchema);