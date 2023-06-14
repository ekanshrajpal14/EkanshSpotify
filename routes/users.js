const mongoose = require("mongoose");
const dotenv = require('dotenv').config();


mongoose.connect(process.env.database).then(function(){
  console.log("connect");
}).catch(err => {
  console.log("no connect"+err);
})
// mongoose.connect("mongodb://localhost/spotify").then(function () {
//   console.log("connect");
// });



const passportlm = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  name: String,
  username: String,
  passport: String,
  email: String,
  birth: String,
  gender: String,
  userdp:String,
  isadmin: {
    type: Boolean,
    default: false
  },
  productid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "songs"
  }],
  playlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "playlist"
  }],
  listcounter: {
    type: Number,
    default: 1
  },
  address: String,
  contactnumber: Number,
  pic: {
    type:String,
    default:""
  },
  createdadminsongs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"songs"
  }],
  adminExtra:String,
  adminExtra2:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "songs"
  }]

});

userSchema.plugin(passportlm);
module.exports = mongoose.model("user", userSchema);

