var tpb = document.querySelector(".tapplaybtn");

if (tpb != null) {
    var reqPlaylist = tpb.dataset.playbtn;
}
var audio = document.querySelector("#aud");
var songslist = [];
var currentSongIndexaaaa = 0;
var songid = [];
var songAllInfo = [];
var tempId = [];
if (tpb != null) {
    tpb.addEventListener("click", function (d) {
        axios.get(`/playinglist/${reqPlaylist}`).then(function (songs) {
            if (songslist.length == 0) {
                songs.data.list.forEach(element => {
                    songslist.push(element.song)
                    songid.push(element._id);

                });
            }
            if (songAllInfo.length == 0) {
                songAllInfo = songs.data.list;

            }
            var newData = songs.data.user.productid;
            newData.forEach(e => {
                tempId.push(e._id)
            })
            currentSongIndexaaaa = 0;
            // console.log(newData);
            playSong(0);
            dataput(currentSongIndexaaaa, songAllInfo, tempId);

        })
        if (window.screen.width > 600) {
            document.querySelector(".player_bot").style.bottom = "0";

        }
        else {
            document.querySelector(".player_bot").style.bottom = "9.5vh";

        }
    })
}
function playSong(index) {
    currentSongIndexaaaa = index;
    const songurl = songslist[index];
    audio.src = songurl;
    audio.play();
}
// new playsong function banana h 
function newPlaySong(index, id, listid) {
    currentSongIndexaaaa = index;
    axios.get(`/songsid/${id}/${listid}`).then(function (song) {

        if (songslist.length == 0) {
            song.data.songslink.forEach(function (el) {
                songslist.push(el)
            })
        }
        if (songAllInfo.length == 0) {
            songAllInfo = song.data.allplaylistsonsg;
            // console.log(songAllInfo);
        }

        const songurl = songslist[index];
        audio.src = songurl;
        audio.play();
        // console.log(song.data.checkofsong);
        var checksum = song.data.checkofsong;
        dataput(currentSongIndexaaaa, songAllInfo, false, checksum)
    })

    if (window.screen.width > 600) {
        document.querySelector(".player_bot").style.bottom = "0";

    }
    else {
        document.querySelector(".player_bot").style.bottom = "9.5vh";

    }
}

audio.addEventListener("ended", playNextSong);
function playNextSong() {
    currentSongIndexaaaa = (currentSongIndexaaaa + 1) % songslist.length;
    let songurl = songslist[currentSongIndexaaaa];
    audio.src = songurl;
    audio.play();
    dataput(currentSongIndexaaaa, songAllInfo, tempId);
}

function dataput(index, info, newdata, checksum) {
    document.querySelector("#songnamehere").innerHTML = info[index].track;
    document.querySelector(".text_one p").innerHTML = info[index].artist;
    document.querySelector(".side_img img").src = info[index].image;
    // console.log()
    if (tempId.includes(info[index]._id) || checksum) {
        document.querySelector(".like_sec").innerHTML = `<i class="ri-heart-fill "style="color: #1DB954;"></i>`

    }
    else {
        document.querySelector(".like_sec").innerHTML = `<i class="ri-heart-line"></i>`

    }
    document.querySelector(".like_sec").dataset.likesec = `${info[index]._id}`;
}

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


// minimize window of playingsong
var arrow = 0;
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


var flag = 0;
const volumeControl = document.querySelector('#volume-control');
const repeatbtn = document.querySelector(".repeat");
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

