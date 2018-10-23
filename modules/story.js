var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
    picture:{ type: String},
    title:{ type: String, required: true },
    content:{ type: String, required: true }
});

module.exports = mongoose.model('Story',storySchema);