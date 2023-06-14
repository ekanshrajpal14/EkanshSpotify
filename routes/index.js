var express = require('express');
var router = express.Router();
var passport = require('passport');
const localStrategy = require('passport-local');
const multer = require('multer');
var userModel = require('./users');
var songModel = require('./songs');
var playlistModel = require('./playlist');
passport.use(new localStrategy(userModel.authenticate()));
var validator = require("node-email-validation");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const fs = require("fs");
const dotenv = require('dotenv').config();
// const { equal } = require('assert');
// const { use } = require('passport');
var sendMail = require("../nodemailer");
const { publicEncrypt } = require('crypto');
// const { Console, log } = require('console');
// const { render } = require('ejs');
// const { userInfo } = require('os');



if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// upload to cloudinary
async function uploadToCloudinary(localFilePaths) {
  try {
    // image wala

    const result1 = await cloudinary.uploader.upload(localFilePaths[0], { folder: "All_songs_and_images", resource_type: 'video', resource_type: "auto" });
    fs.unlinkSync(localFilePaths[0]);
    // song wala

    const result2 = await cloudinary.uploader.upload(localFilePaths[1], { folder: "All_songs_and_images", resource_type: 'video', resource_type: "auto" });
    fs.unlinkSync(localFilePaths[1]);

    return {
      message: "Success",
      url: result2.url,
      url2: result1.url
    };
  } catch (error) {
    console.log(error);
    return { message: "Fail" };
  }
}

// my acc pic upload
async function myAccDp(mydp) {
  var imageUrl;
  await cloudinary.uploader.upload(mydp,{ folder: "acc_folder" },(error, result) => {
      console.log(result);
      fs.unlinkSync(mydp);

      imageUrl = result.secure_url;

    });
  //  await console.log(imageUrl);
  return imageUrl;
}

router.get("/test", function (req, res) {
  res.render("test");
})
router.post("/uplo", upload.single("image"), async function (req, res) {
  var dppath = req.file.path;
  console.log(dppath);
  var url = await myAccDp(dppath);
  await console.log(url);
  await res.send("done");
})
// end of myacc




// Delete the image from Cloudinary
async function deletedToCloud(publicId) {
  await cloudinary.uploader.destroy(publicId, function (error, result) {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
    }
  });
}



// Call the uploader.destroy() method to delete the song with the extracted public ID
async function deletedToCloudaudio(publicIdsong) {
  cloudinary.uploader.destroy(publicIdsong, { resource_type: "video" }, (error, result) => {
    console.log(result);
  });
}


















router.get('/', function (req, res, next) {
  songModel.find().then(function (song) {
    res.render('index', { song });
  })
});

// search part 
router.get("/search", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("playlist").then(function (user) {
    res.render("search", { user });

  })
})



router.get("/search/:search", isLoggedIn, function (req, res) {


  var st = req.params.search.trim();
  const query = {
    $or: [
      { track: { $regex: st, $options: 'i' } },
      { artist: { $regex: st, $options: 'i' } },
      { finder: { $regex: st, $options: 'i' } }
    ]
  };

  songModel.find(query).then(function (docs) {
    res.json(docs)
  })

})


// search end




router.get("/spotify", isLoggedIn, async function (req, res) {
  var user = await userModel.findOne({ username: req.session.passport.user }).populate("playlist");
  var song = await songModel.find();
  if (user.isadmin) {
    res.render("mainadmin2", { user, song });
  }
  else {
    res.render("spotify", { user, song });
  }

})

router.get("/fetchplaylist", isLoggedIn, (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).populate("playlist").then(function (user) {
    res.json(user);
  })
})

router.post("/register", async function (req, res) {
  // var temp = req.body.email;
  // var newtemp = "";
  // temp.toString().split("@").reduce(function (det) {
  //   newtemp = det;
  // })
  let allusers = [];
  var newUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    birth: req.body.birth,
    gender: req.body.gender
  });
  try {
    allusers = await userModel.find({});
  }
  catch (err) { console.log(err); }
  var userExist = false;
  allusers.forEach(function (user) {
    if (user.username == newUser.username) {
      // flash username already exists
      console.log("User Already Exists")
      userExist = true;
    }
  });
  if (userExist === false) {
    userModel.register(newUser, req.body.password).then(function (elem) {
      passport.authenticate('local')(req, res, function () {
        res.redirect("/spotify");
      })
    })
  }
  else {
    res.redirect("sign");
  }

});


router.get("/myaccount", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("playlist").then(function (user) {
    var temp = "";
    songModel.find().then(function (songs) {
      // if (user.playlist.length != 0) {

      //   user.playlist.forEach(element => {
      //     console.log(element.songs[0]._id);
      //     temp = element.songs[0]._id;
      //     console.log(temp);
      //     songModel.findById(temp).then(function (imagesong) {
      //       res.render("myaccount", { user, songs, imagesong });
      //     })
      //   });
      // }
      // else{
      res.render("myaccount", { user, songs });

      // }


    })
  })
})

router.post("/edit/profile", upload.single("pic"), isLoggedIn, async function (req, res) {
  console.log(req.file);
  userModel.findOneAndUpdate({ username: req.session.passport.user }, { name: req.body.name, email: req.body.email }).then(async function (updateuser) {
    if (req.file != undefined) {
      if (updateuser.pic != "") {

        const urlimage = await updateuser.pic;
        const publicId = await urlimage.split('/').pop().split('.')[0];
        var folerrpublicid = "acc_folder/" + publicId;
        await deletedToCloud(folerrpublicid);
      }

      var dppath = req.file.path;
      var url = await myAccDp(dppath);
      await console.log(url);
      updateuser.pic = await url;
      await updateuser.save();
    }
    // acc_folder / peg2lr0db6kqau47gdb3
    else {
      console.log("null");

    }
    res.redirect("back");
  })
})


router.post("/login", passport.authenticate("local", {
  successRedirect: '/spotify',
  failureRedirect: "/login"
}), function (req, res) { });





router.get('/failed', function (req, res, next) {
  res.send("nhi hua");
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  })
});


router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/sign', function (req, res, next) {
  res.render('sign');
});


// admin work 

router.get("/songs/data", isLoggedIn, function (req, res) {
  songModel.find().then(function (songs) {
    res.json(songs);
  })
})



router.get("/edit/song/:songid", isLoggedIn, async function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
    var songinfo = await songModel.findOne({ _id: req.params.songid });
    if (user.isadmin) {
      res.render("editSong", { user, songinfo });
    }
    else {
      res.redirect("back");
    }
  })
})

router.post("/edit/song/:songid", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    if (user.isadmin) {
      songModel.findOneAndUpdate({ _id: req.params.songid }, {
        artist: req.body.artist,
        track: req.body.track,
        album: req.body.album,
        categories: req.body.categories,
        email: req.body.email,
      }).then(function (edited) {
        res.redirect("/spotify");
      })

    }
    else {
      res.redirect("back");
    }
  })
})

router.get("/delete/song/:songid", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
    if (user.isadmin) {
      await songModel.findOne({ _id: req.params.songid }).then(async function (song) {
        const urlimage = song.image;
        const urlsong = song.song;
        const publicIdsong = urlsong.split('/').pop().split('.')[0];
        const publicId = urlimage.split('/').pop().split('.')[0];
        await deletedToCloud(publicId);
        await deletedToCloudaudio(publicIdsong);
        var adminsongs = await user.createdadminsongs.indexOf(req.params.songid);
        await user.createdadminsongs.splice(adminsongs, 1);
        await user.save();
      })
      await songModel.findOneAndDelete({ _id: req.params.songid }).then(async function (deleted) {

        await res.redirect("/spotify");

      })

    }
    else {
      res.redirect("back");
    }
  })
})
router.get("/songs/upload", isLoggedIn, function (req, res) {
  res.render("songupload");
})


router.post("/song/upload", isLoggedIn, upload.fields([{ name: "song", maxCount: 1 }, { name: "template", maxCount: 1 }]), async function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
    if (user.isadmin) {
      var tempStoreSong = req.files["song"][0].path;
      var tempStoreImg = req.files["template"][0].path;
      var locaFilePaths = [tempStoreImg, tempStoreSong];
      console.log(tempStoreImg);
      var result = await uploadToCloudinary(locaFilePaths);

      songModel.create({
        artist: req.body.artist,
        email: req.body.email,
        track: req.body.track,
        album: req.body.album,
        song: result.url,
        image: result.url2,
        categories: req.body.categories,
        finder: req.body.finder


      }).then(function (create) {

        user.createdadminsongs.push(create._id);
        user.save();
        res.redirect("/spotify");

      });
    }
    else {
      res.redirect("/");
    }
  });
});

// admin work




// playlist work
router.get("/createplaylist", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    // var playListCount = Number(user.playlist.length)+1;  
    var playListCount = user.listcounter++;
    var playListName = "Playlist #" + playListCount;
    playlistModel.create({ playlist: playListName, creater: user._id }).then(function (createplaylist) {
      user.playlist.push(createplaylist._id);
      user.save();
      res.json(createplaylist);
    })
  })
})

router.get("/playlist/:listid/song/:songid", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    playlistModel.findOne({ _id: req.params.listid }).then(function (playList) {
      if (playList.songs.includes(req.params.songid) == false) {
        playList.songs.push(req.params.songid);
        playList.save();
      }
      else {
        console.log("already hai ");
      }
      res.redirect(`/openplaylist/${req.params.listid}`);
    })

  })
})


router.get("/deleteplaylist/:listdel", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    playlistModel.findOneAndDelete({ _id: req.params.listdel }).then(function (del) {
      user.listcounter--;
      user.playlist.splice(user.playlist.indexOf(req.params.listdel), 1);
      user.save();
      res.redirect("/spotify");
    })
  })
})


router.get("/openplaylist/:listid", isLoggedIn, async function (req, res) {
  var user = await userModel.findOne({ username: req.session.passport.user }).populate("playlist");
  var list = await playlistModel.findOne({ _id: req.params.listid }).populate("songs")
  res.render("playlist", { user, list });
})


router.get("/remove/:playlistid/song/:songid", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    playlistModel.findOne({ _id: req.params.playlistid }).then(function (listinfo) {
      var songidtemp = listinfo.songs.indexOf(req.params.songid);
      listinfo.songs.splice(songidtemp, 1);
      listinfo.save();
      res.redirect("back");
    })
  })
})

router.post("/edit/playlist/:listid", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    playlistModel.findOneAndUpdate({ _id: req.params.listid }, { playlist: req.body.playlistname })
      .then(function (updatelist) {
        res.redirect("back");
      })
  })
})




// router.get("/findplay", (req, res) => {
//   playlistModel.find().then(function (dt) {
//     res.send(dt)
//   })
// })


// router.get("/finddel", (req, res) => {
//   songModel.find().then(function (dt) {
//     res.send(dt)
//   })
// })


// router.get("/read", function (req, res) {
//   userModel.findOne({ username: "ekku" }).then(function (dets) {
//     // dets.finder = "maanmerijaan";
//     // dets.save()
//     res.send(dets);
//   })
// })

//   userModel.find({isadmin:true}).then(function (user) {
//     // var adminsongs = user.createdadminsongs.indexOf("641dddc7c2498d9957f91b0f");
//     // user.createdadminsongs.push("641ddea5c2498d9957f91b43");
//     // user.save();
//     // user.listcounter = 0;

//     // res.render("test", { user })
//     res.send(user)
//   })
// })

// router.get("/readuser", function (req, res) {
//   userModel.find().populate("productid").then(function (user) {

//     user.forEach(function (e) {  
//       e.productid.forEach(function(d){
//         if (d._id == ""){
//           e.productid.
//         }
//       })
//     })
//     res.send("hek")

//   })
// })






router.get('/play/:songid', isLoggedIn, async function (req, res, next) {
  var user = await userModel.findOne({ username: req.session.passport.user }).populate("playlist");
  var songPlaying = await songModel.findOne({ _id: req.params.songid });
  var prod = await user.productid.includes(req.params.songid);
  songPlaying.viewson++;
  songPlaying.save();
  res.json({ songPlaying, user, prod });
});



router.get("/add/like/:id", isLoggedIn, function (req, res) {
  var addedsong = false;
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    songModel.findOne({ _id: req.params.id }).then(function (song) {
      if (user.productid.includes(song._id)) {
        var indexofarr = user.productid.indexOf(song._id);
        user.productid.splice(indexofarr, 1);
        //  user.productid.pop();
        user.save();
      }
      else {
        user.productid.push(song._id);
        user.save();
        addedsong = true
      }

      res.json(addedsong);
    })
  })

})



router.get("/categories/:cate", isLoggedIn, async function (req, res) {
  var user = await userModel.findOne({ username: req.session.passport.user }).populate("playlist");
  var catego = await req.params.cate;
  songModel.find({ categories: req.params.cate }).then(function (song) {
    res.render("categories", { user, song, catego });
  })
})



router.get("/likedsongs", isLoggedIn, async function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("productid").populate("playlist").then(function (user) {
    res.render("liked", { user });

  })
})

router.get("/playing/:songid", isLoggedIn, async function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("playlist").then(function (user) {
    var prod = user.productid.includes(req.params.songid);
    songModel.findOne({ _id: req.params.songid }).then(function (song) {
      song.viewson++;
      song.save();
      res.render("playsong", { user, song, prod });

    })

  })
})

router.get("/playinglist/:listname", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("productid").then(function (user) {
    playlistModel.findOne({ _id: req.params.listname }).populate("songs").then(function (list) {
      res.json({ list: list.songs, user: user });
    })
  })
})

router.get("/allsongs", isLoggedIn, async function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("playlist").then(async function (user) {
    var song = await songModel.find();
    await res.render("allsongs", { user, song });

  })

})


router.get("/songsid/:id/:listid", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    songModel.findOne({ _id: req.params.id }).then(function (song) {
      var checkofsong = false;
      if (user.productid.includes(song._id)) {
        checkofsong = true;
      }
      else {
        checkofsong = false;
      }
      playlistModel.findOne({ _id: req.params.listid }).populate("songs").then(function (list) {
        var songslink = [];
        var allplaylistsonsg = [];
        list.songs.forEach(function (d) {
          songslink.push(d.song);
          allplaylistsonsg.push(d)
        })
        console.log(songslink);
        res.json({ song, checkofsong, songslink, allplaylistsonsg });

      })
    })
  })
})




router.get("/admin/admincreating", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    user.isadmin = true;
    user.save();
    res.send(user);
  })
})





// router.get("/del", function (req, res) {
//   songModel.findByIdAndDelete("6415b133630225c4800308e6").then(function (dets) {
//     res.send(dets);
//   })
// })




router.get("/forgot", function (req, res) {
  res.render("forgotpw");
})

router.post("/forgot/:email", function (req, res) {
  var check = validator.is_email_valid(req.params.email);
  if (check) {
    userModel.findOne({ email: req.params.email }).then(function (user) {
      if (user) {
        var numrandom = Math.floor(100000 + Math.random() * 900000);
        user.contactnumber = numrandom;
        user.save();
        sendMail.sendMail(user.email, user.contactnumber, user.username).then(res => {
          console.log("sent mail !!", res);
        });
        res.json("sent");

      }
      else {
        res.json("Incorrect Email");
      }

    });
  }
  else {
    res.json("Incorrect Email");

  }

})


router.post("/check/:email/otp/:otp", function (req, res) {
  userModel.findOne({ email: req.params.email }).then(function (user) {
    if (user.contactnumber == req.params.otp) {
      user.contactnumber = 0;
      user.save();
      res.json(user);
    }
    else {
      user.contactnumber = 0;
      user.save();
      res.json(false)
    }

  })
})

router.get("/setpassword/:email", function (req, res) {
  var email = req.params.email;
  userModel.findOne({ email: email }).then(function (user) {
    var randomnum = Math.floor(Math.random() * 100).toString();
    res.render("setPassword", { email });

  })
})

router.post("/setpassword/:id", function (req, res) {
  userModel.findOne({ _id: req.params.id }).then(function (user) {
    user.setPassword(req.body.newpassword, function (done) {
      user.save();
      res.redirect("/login");
    });
    // user.setPassword(req.body.newpassword, function(d){
    // });
    // user.save();
    // res.redirect("/login")

  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();

  }
  else {
    res.redirect("/login");
  }
}




// router.get('/songupload',isLoggedIn,function(req,res){
//   res.render("");
// })




// router.post("/songupload", isLoggedIn, async function (req, res) {
//   userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
//     if (user.isadmin) {
//       songModel.create({
//         artist: req.body.artist,
//         email: req.body.email,
//         track: req.body.track,
//         album: req.body.album,
//         song: req.body.song,
//         image: req.body.template,
//         categories: req.body.categories,
//         finder: req.body.finder
//       }).then(function (create) {
//         user.createdadminsongs.push(create._id);
//         user.save();
//         res.redirect("/spotify");
//       });
//     }
//     else {
//       res.redirect("/");
//     }
//   });
// });



module.exports = router;
