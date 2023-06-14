const mongoose = require("mongoose");


var userSchema = mongoose.Schema({
    playlist:String,
    creater:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    songs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "songs"
    }],
    extra:String,
    onemore:String,
    extraarr:{
        type:Array,
    }

});

module.exports = mongoose.model("playlist", userSchema);

