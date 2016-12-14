//
// /**
//  * Created by Taha on 03/12/2016.
//  */
//
// var http = require('http'),
//     fs = require('fs'),
//     url = require('url');
//
// //var db = require('../db');
//
// http.createServer(function(request, response){
//     var path = url.parse(request.url).pathname;
//     var url_parts = url.parse(request.url, true);
//     var query = url_parts.query;
//     var url_parts = url.parse(request.url, true);
//     var query = url_parts.query;
//     var setval = {name: query.name, password: query.pass};
//
//     var result = db.query("select * from users  where ( email = '"+setval.name+"' or username = '"+setval.name+"' ) and password = '"+setval.password+"' ", setval, function (err, result) {
//         if (err)
//             throw err;
//         if(result[0]){
//
//             console.log(result[0].username);
//             request.session.email = "name";
//             console.log(request.session.email);
//
//
//             // req.session.email = req.param('name');
//             // app.use(express.cookieParser());
//             // app.use(express.session({ secret: 'something', store: store }));
//
//
//         }
//
//     });
// }).listen(9000);