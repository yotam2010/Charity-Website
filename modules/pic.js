var mongoose = require("mongoose");

var pictureSchema = new mongoose.Schema(
    {url:{ type: String, required: true },
    event:String,
    date:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Picture',pictureSchema);