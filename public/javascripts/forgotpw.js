var email = document.querySelector(".email");
var submit = document.querySelector("#sub");
var emailSub = "";
submit.addEventListener("click", function () {
    if (email.value == "") {
        alert("Please first fill email")
    }
    else {
        email.setAttribute("disabled", "");
        emailSub = email.value;
        submit.style.display = "none";
        axios.post(`/forgot/${emailSub}`).then(function (dets) {
            document.querySelector(".onetime").style.display = "block";
            // console.log(dets.data);
            document.querySelector(".sent").style.display = "block";


        });
    }
});


document.querySelector(".otp").addEventListener("input", function () {
    var otp = document.querySelector(".otp").value;

    if (otp.length <= 5) {
        console.log("nothing");
    }
    else {
        document.querySelector(".otp").setAttribute("disabled", "")
        axios.post(`/check/${emailSub}/otp/${otp}`).then(function (dets) {
            // console.log(dets.data);
            if (dets.data == false) {
                alert("Sorry! Incorrect OTP Try Again");
                window.location.replace("/");
            }
            else {
                window.location.replace(`/setpassword/${dets.data._id}`);

            }
        });
    };
});