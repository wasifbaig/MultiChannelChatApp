$( document ).ready(function() {

    if(window.location.hash) {

   document.getElementById("succmsg").style.display = "block";
    } else {
        // Fragment doesn't exist
        document.getElementById("succmsg").style.display = "none";
    }
});

function signup_validins()
{

    if(!$("#signupform").valid())return false;
    var name = document.getElementById("usernamesignup");
    var email = document.getElementById("emailsignup");
    var pass = document.getElementById("cfmPassword");

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://localhost:1101/uri?name="+name.value+"&email="+email.value+"&pass="+pass.value, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            string=xmlhttp.responseText;
        }
    }
    xmlhttp.send();

}



function signup_validations_google(name_g,email_g,pass_g)
{

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://localhost:1102/uri?name="+name_g+"&email="+email_g+"&pass="+pass_g, true);
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            string=xmlhttp.responseText;
            alert("Registration successful");
        }
    }
    xmlhttp.send();

}

function signin()
{

    if(!$("#signinform").valid())return false;
    var name = document.getElementById("username");
    var pass = document.getElementById("password_login");

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://localhost:9000/uri?name="+name.value+"&pass="+pass.value, true);
    xmlhttp.onreadystatechange=function(){

        if (xmlhttp.readyState==4){
            window.location = "./rooms";

        }

    }
    xmlhttp.send();

    alert("loginscrpt 41");

}




$("#signupform").validate({});
$("#signinform").validate({});


function signup_validation()
{


    return false;
}

function password_validation()
{



}