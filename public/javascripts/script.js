var likeflag = 0;
var songcard = document.querySelectorAll(".song_card_route");
var audio = document.querySelector("#aud");
var Isplaying = false;

songcard = [...songcard];
// somgs playing area  
songcard.forEach(function (dets) {
    dets.addEventListener("click", function (elem) {
        Isplaying = true;

        var id = elem.target.dataset.name;

        axios.get(`/play/${id}`).then(function (resp) {
            likeflag = 1;
            document.querySelector("#songnamehere").innerHTML = resp.data.songPlaying.track
            document.querySelector(".text_one p").innerHTML = resp.data.songPlaying.artist
            audio.src = resp.data.songPlaying.song;
            audio.play();
            if (resp.data.prod) {

                document.querySelector(".like_sec").innerHTML = `<i class="ri-heart-fill "style="color: #1DB954;"></i>`
                // document.querySelector(".text_heart").innerHTML = `<a href="" class="like_sec"><i class="ri-heart-fill "style="color: #1DB954;"></i></a>`
            }
            else {
                document.querySelector(".like_sec").innerHTML = `<i class="ri-heart-line"></i>`

                // document.querySelector(".text_heart").innerHTML = `<a href="" class="like_sec"><i class="ri-heart-line"></i></a>`

            }

            document.querySelector(".side_img img").src = resp.data.songPlaying.image;

            document.querySelector(".like_sec").dataset.likesec = `${resp.data.songPlaying._id}`;


            // document.querySelector(".like_sec").setAttribute("href", `/add/like/${resp.data.songPlaying._id}`);
            var newClutter = "";
            resp.data.user.playlist.forEach(function (det) {
                newClutter += `<div class="listPlay addtoplaylist">
                                            <a id="addtolist" href="/playlist/${det._id}/song/${id}">${det.playlist}</a>
                                        </div>`

            })
            document.querySelector(".options_playlist").innerHTML = newClutter;


        })
        if(window.screen.width>600){
            document.querySelector(".player_bot").style.bottom = "0";

        }
        else{
            document.querySelector(".player_bot").style.bottom = "8vh";

        }
    })
})

// adding to like section 
document.querySelector(".like_sec").addEventListener("click", function (d) {
    var idval = this.getAttribute('data-likesec')
    axios.get(`/add/like/${idval}`).then(function (added) {
        if (added.data) {
            document.querySelector(".like_sec").innerHTML = `<i class="ri-heart-fill "style="color: #1DB954;"></i>`
        }
        else {
            document.querySelector(".like_sec").innerHTML = `<i class="ri-heart-line"></i>`
        }

    })


})
var arrow = 0;

// minimize window of playingsong
document.querySelector(".down_arrow").addEventListener("click", function () {
    if (arrow == 0) {
        document.querySelector(".player_bot").style.bottom = "-12%";
        document.querySelector(".down_arrow").style.transform = "rotate(180deg)";
        document.querySelector(".down_arrow").style.top = "-35%";
        arrow = 1;
    }
    else {
        arrow = 0;
        document.querySelector(".player_bot").style.bottom = "0%";
        document.querySelector(".down_arrow").style.transform = "rotate(0deg)"
        document.querySelector(".down_arrow").style.top = "-15%";


    }
})



const volumeControl = document.querySelector('#volume-control');
const repeatbtn = document.querySelector(".repeat");
var flag = 0;
// repeat
repeatbtn.addEventListener("click", function (re) {
    if (flag == 0) {
        flag = 1;
        audio.setAttribute("loop", "");
        repeatbtn.style.color = "#fff"
    }
    else {
        flag = 0;
        audio.removeAttribute("loop");
        repeatbtn.style.color = "grey"

    }
})



function updateVolume() {
    audio.volume = volumeControl.value;
    if (audio.volume == 0) {
        document.querySelector(".mutebtn").style.display = "block"
        document.querySelector(".volbtn").style.display = "none"
    }
    else {
        document.querySelector(".volbtn").style.display = "block"
        document.querySelector(".mutebtn").style.display = "none"


    }
}


volumeControl.addEventListener('input', () => {
    updateVolume();

});

// categories section 
var Categories = [{ name: "Lofi-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664020/ALL_PHOTO_OF_SPOTIFY/lofi_h2k84n.jpg", route: "lofi", desc: "Typically consisting of non-lyrical music and looped, distorted samples" }, { name: "Romantic-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664022/ALL_PHOTO_OF_SPOTIFY/roma_y36wok.jpg", route: "romantic", desc: "A love song is a song about romantic love, falling in love" }
    , { name: "Sad-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664022/ALL_PHOTO_OF_SPOTIFY/sad_fvoyz8.jpg", route: "sad", desc: "Lower overall pitch, narrow pitch range, slower tempo" }, { name: "Punjabi-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664021/ALL_PHOTO_OF_SPOTIFY/punj_vly3yy.jpg", route: "punjabi", desc: "Punjabi music's immense popularity is its music, beats and composition" }, { name: "Pop-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664022/ALL_PHOTO_OF_SPOTIFY/pop_ic6ruz.jpg", route: "pop", desc: "Music that is popular in the mainstream." }
    , { name: "Bhakti-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664020/ALL_PHOTO_OF_SPOTIFY/bhakti_fermlk.jpg", route: "bhakti", desc: " Devotional song with a religious theme or spiritual ideas" }, { name: "Patriotic-Songs", img: "https://res.cloudinary.com/dzotxhnz0/image/upload/v1686664020/ALL_PHOTO_OF_SPOTIFY/patr_tlsaay.jpg", route: "patriotic", desc: "A patriotic song is one which inspires feelings of pride in one's country" }];
var clutter = "";
Categories.forEach(function (det) {
    clutter += `<div class="song_card">
                                <a href="/categories/${det.route}">
                                    <div class="song_card_temp">
                                        <div class="playbtn"><i class="ri-play-fill"></i></div>

                                        <div class="song_img">
                                            <img src="${det.img}" alt="">
                                        </div>
                                        <div class="song_body">
                                            <h6>${det.name}</h6>
                                            <p>${det.desc}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>`
});
document.querySelector(".clutter_in").innerHTML = clutter;

// playlist lagaya hai yaha pr
function playlistImplementDiv(creates) {
    var playdiv = document.createElement("div");
    playdiv.className = "listPlay d-flex";
    var a_play = document.createElement("a");
    var a_play2 = document.createElement("span");
    a_play.href = `/openplaylist/${creates._id}`;

    a_play.innerHTML = `${creates.playlist}`;
    a_play2.className = "delbtn";
    a_play2.setAttribute("data-list", `/deleteplaylist/${creates._id}`);
    // a_play2.innerHTML = `<i
    //                                 class="ri-delete-bin-6-line"></i>`;
    playdiv.appendChild(a_play);
    // playdiv.appendChild(a_play2);
    // console.log(playdiv);
    var jsplay = document.querySelector(".playlistjs");
    jsplay.appendChild(playdiv);
}

// onlick add play[list]
document.querySelector(".create").addEventListener("click", function () {

    axios.get("/createplaylist").then(function (creates) {
        // console.log(creates.data);
        var cr = creates.data
        playlistImplementDiv(cr);
    })
})

var delbtnspan;
function delPlayList() {
    var delbtnspan2;

    delbtnspan = document.querySelectorAll(".delbtn");
    delbtnspan2 = [...delbtnspan];
    return delbtnspan2;
}



window.addEventListener("load", function () {
    axios.get("/fetchplaylist").then(async function (userlist) {
        //    console.log(userlist.data.playlist);
        var temparr = userlist.data.playlist;
        temparr.forEach(async function (de) {
            playlistImplementDiv(de)
            delPlayList();  // only for span del list selector

        });
    })
})


// / deleteplaylist /: listdel

// var newArrOfSpan = document.querySelectorAll(".delbtn");
// newArrOfSpan = [...newArrOfSpan];

// newArrOfSpan.forEach(function (dets) {
//     dets.addEventListener("click", function (d) {
//         // console.log("hello");
//     })
// })






// responsve work here 


function openSet(){
    document.querySelector(".sideSetBar").style.top = "0"
    document.querySelector(".sideSetBar").style.left = "0"
}
function closeSet() {
    document.querySelector(".sideSetBar").style.top = "0%"
    document.querySelector(".sideSetBar").style.left = "100%"
}





var resp_arrow = 0;
document.querySelector(".resp_arrow").addEventListener("click", function () {
    if (resp_arrow == 0) {
        document.querySelector(".player_bot").style.height = "100%"
        document.querySelector(".resp_arrow").style.transform = "rotate(180deg)";
        document.querySelector(".resp_arrow").style.top = "6vh";
        document.querySelector(".player_bot").classList.add("player_bot_act");
        document.querySelector(".one").classList.add("one_active");
        document.querySelector(".side_img").classList.add("image_act");
        document.querySelector(".text_one").classList.add("text_one_act");
        document.querySelector(".two").classList.add("two_act");
        document.querySelector(".three").classList.add("three_act");
        document.querySelector(".share_line").classList.add("display_block");
        // document.querySelector(".resp_pause").classList.add("display_none");
        document.querySelector(".vol").classList.add("display_none");
        document.querySelector(".one_cont").classList.add("one_cont_act");
        document.querySelector(".extraForResp").classList.add("resp_act");


        resp_arrow = 1;
    }
    else {
        document.querySelector(".player_bot").style.height = "7.6vh"
        document.querySelector(".resp_arrow").style.top = "-10%";

        document.querySelector(".resp_arrow").style.transform = "rotate(0deg)"
        document.querySelector(".player_bot").classList.remove("player_bot_act");
        document.querySelector(".one").classList.remove("one_active");
        document.querySelector(".side_img").classList.remove("image_act");
        document.querySelector(".text_one").classList.remove("text_one_act");
        document.querySelector(".two").classList.remove("two_act");
        document.querySelector(".three").classList.remove("three_act");
        document.querySelector(".share_line").classList.remove("display_block");
        // document.querySelector(".resp_pause").classList.remove("display_none");
        document.querySelector(".vol").classList.remove("display_none");
        document.querySelector(".one_cont").classList.remove("one_cont_act");
        document.querySelector(".extraForResp").classList.remove("resp_act");
        resp_arrow = 0;
    }

})



// if (window.screen.width < 600) {
//     var comingsooncheck = 0;
//     document.querySelector(".comingsoon").addEventListener("click", function (d) {
//         if (comingsooncheck === 0) {
//             document.querySelector(".listdiffer2").style.display = "flex";
//             comingsooncheck = 1
//         }
//         else {
//             comingsooncheck = 0
//             document.querySelector(".listdiffer2").style.display = "none";

//         }
//     })

// }





if (window.screen.width < 600) {
    var comingsooncheck = 0;
   
    document.querySelector(".comingsoon").addEventListener("click", function (d) {
        if (comingsooncheck === 0) {
            if (Isplaying) {
                document.querySelector(".listdiffer2").style.bottom = "14vh"
                document.querySelector(".listdiffer2").style.zIndex = "999999999999999999";
            }

            document.querySelector(".listdiffer2").style.display = "flex";
            comingsooncheck = 1
        }
        else {
            comingsooncheck = 0
            document.querySelector(".listdiffer2").style.display = "none";

        }

    })

}