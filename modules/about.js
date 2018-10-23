var mongoose = require("mongoose");

var aboutSchema = new mongoose.Schema({
    title:{ type: String, required: true },
    content:{ type: String, required: true }
});


module.exports = mongoose.model('About',aboutSchema);