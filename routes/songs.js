const mongoose = require("mongoose");


var userSchema = mongoose.Schema({
    artist:String,
    email:String,
    track:String,
    album:String,
    image:String,
    song:String,
    categories :String,
    viewson:{
        type:Number,
        default:0
    },
    finder:String,
    extraSongs:String
});

module.exports = mongoose.model("songs", userSchema);

