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






// responsve work here 


function openSet() {
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
        document.querySelector(".player_bot").style.backgroundColor= "#000"
        document.querySelector(".player_bot").style.height = "93%"
        document.querySelector(".resp_arrow").style.transform = "rotate(180deg)";
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
        document.querySelector(".player_bot").style.backgroundColor = "rgba(0, 0, 0, 0.742)"
        document.querySelector(".player_bot").style.height = "7.6vh"
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






// adding new part of comon



if (window.screen.width < 600) {
    var comingsooncheck = 0;
    document.querySelector(".comingsoon").addEventListener("click", function (d) {
        if (comingsooncheck === 0) {
            document.querySelector(".listdiffer2").style.display = "flex";
            comingsooncheck = 1
        }
        else {
            comingsooncheck = 0
            document.querySelector(".listdiffer2").style.display = "none";

        }
    })

}