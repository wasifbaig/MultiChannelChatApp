
var http = require('http'),
    fs = require('fs'),
    url = require('url');

module.exports = {
    signup_validations_google: function (name_g,email_g,pass_g) {

        http.get("http://www.google.com/index.html", function(res) {

            console.log("Got response: " + res.statusCode);

            if(res.statusCode == 200) {
                console.log("Got value: " + res.statusMessage);
            }

        }).on('error', function(e) {
            console.log("Got error: " + e.message);

        });


    }
};

// var request = require('request');
//
// module.exports = {
//     signup_validations_google: function (name_g,email_g,pass_g) {
//
//
//         console.log("social hwere")
//         // request('http://localhost:6000', function (error, response, body) {
//         //     if (!error && response.statusCode == 200) {
//         //         console.log(body) // Print the body of response.
//         //     }npm
//         // })
//         // xmlhttp = new XMLHttpRequest();
//         // xmlhttp.open("GET","http://localhost:1102/uri?name="+name_g+"&email="+email_g+"&pass="+pass_g, true);
//         // xmlhttp.onreadystatechange=function(){
//         //     if (xmlhttp.readyState==4 && xmlhttp.status==200){
//         //         string=xmlhttp.responseText;
//         //         alert("Registration successful");
//         //     }
//         // }
//         // xmlhttp.send();
//
//
//
//     }
// };
