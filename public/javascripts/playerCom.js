

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


