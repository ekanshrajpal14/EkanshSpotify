var songcard = document.querySelectorAll(".song_card_route");
var audio = document.querySelector("#aud");

songcard = [...songcard];
// somgs playing area  
songcard.forEach(function (dets) {

    dets.addEventListener("click", function (elem) {

        // var id = elem.target.dataset.name;
        var id = this.getAttribute('data-name')


        axios.get(`/play/${id}`).then(function (resp) {
            
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
            if(document.querySelector(".options_playlist")!= null){
                document.querySelector(".options_playlist").innerHTML = newClutter;
            }


        })
        if (window.screen.width > 600) {
            document.querySelector(".player_bot").style.bottom = "0";

        }
        else {
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



var volumeControl = document.querySelector('#volume-control');
var repeatbtn = document.querySelector(".repeat");
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