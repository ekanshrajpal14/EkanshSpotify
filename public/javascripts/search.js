function searchopt(val) {
    axios.get(`/search/${val}`).then(function (dets) {
        // console.log(dets.data);
        var cluttersearch = "";

        if (dets.data.length < 1) {
            document.querySelector("#noresult").style.display = "block";
            document.querySelector(".layer1_songs").innerHTML = "";

        }
        else {

            document.querySelector("#noresult").style.display = "none";

            dets.data.forEach(element => {
                cluttersearch += ` <div class="song_card song_card_route" data-name="${element._id}">
                                
                                <div class="song_card_temp">
                                    <div class="playbtn"><i class="ri-play-fill"></i></div>
                                    <div class="song_img">
                                        <img src="${element.image}" alt="">
                                    </div>
                                    <div class="song_body">
                                        <h6>${element.track}</h6>
                                        <p>${element.artist}</p>
                                    </div>
                                </div>
                                

                            </div>`
                document.querySelector(".layer1_songs").innerHTML = cluttersearch;


            });
        }
        reValueDiv();
    })
}
document.querySelector("#input").addEventListener("input", function () {
    const trimmedValue = document.querySelector("#input").value.replace(/[^\w\s]/gi, '');

    var val = trimmedValue.trim();
    if (val == "") {
        document.querySelector(".search").style.border = "2px solid red";
        document.querySelector(".layer1_songs").innerHTML = "";
    }
    else {
        document.querySelector(".search").style.border = "none";

        searchopt(val)

    }

})
document.querySelector(".right").addEventListener("click", function () {
    document.querySelector(".search").style.border = "none";

})
var likeflag = 0;
var songcard = []
var audio;
function reValueDiv() {
    songcard = document.querySelectorAll(".song_card_route");
    audio = document.querySelector("#aud");
    songcard = [...songcard];
    // console.log(songcard);

    SongCardRoute(songcard)
}

// somgs playing area  
function SongCardRoute(songcard) {
    songcard.forEach(function (dets) {

        dets.addEventListener("click", function (elem) {

            // var id = elem.target.dataset.name;
            var id = this.getAttribute('data-name')


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
            if (window.screen.width > 600) {
                document.querySelector(".player_bot").style.bottom = "0";

            }
            else {
                document.querySelector(".player_bot").style.bottom = "8vh";

            }
        })
    })

}
