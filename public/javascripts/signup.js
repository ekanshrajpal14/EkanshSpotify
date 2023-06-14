const para = document.createElement("p");
document.querySelector(".emailtwo").addEventListener("input", function (de) {
    var emailsave = document.querySelector(".emailone").value;
    var emailsave2 = document.querySelector(".emailtwo").value;
    // var newemail = emailsave.toString();
    // var nesave = newemail.split("@").reduce(function(user){
    //     console.log(user)
    // })
    if (emailsave != emailsave2) {
        para.innerHTML = "The email addresses don't match.";
        para.style.color = "red"
    }
    else if (emailsave === "") {
        para.innerHTML = "First enter the upper field";
    }
    else {
        para.innerHTML = "The email addresses is matched."
        para.style.color = "green"


    }
    document.querySelector(".confirm").appendChild(para);
})
