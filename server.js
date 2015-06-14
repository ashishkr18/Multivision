var express = require('express'),
    //got stylus library
    stylus = require('stylus'),
    //logger
    logger = require('morgan'),
    //body parser for several other pieces of middleware in express 4
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//use app or server as name for easily relating
var app = express();

//set middleware for stylus
function compile(str, path) {
    return stylus(str).set('filename', path);
}

//setting views property name
app.set('views', __dirname + '/server/views');
app.engine('html', require('ejs').renderFile);
//setting view engine property name
app.set('view engine', 'html');

//for logging use morgan
app.use(logger('dev'));
app.use(bodyParser());

//configuring stylus middleware
//won't do any good without routes to our public directory
app.use(stylus.middleware(
    // pass configuring object
    {
        src: __dirname + '/public',
        compile: compile
    }
));
//using express static middleware to search for any file inside public directory, for eg: for a request of /favicon.ico, it will search for it inside the /public directory
//any request for angular will come via vendor/angular/angular.

app.use(express.static(__dirname + '/public'));

//no need for a view engine for html, use middleware static of express
app.use(express.static(__dirname + '/server/views'));



//will connect and create a collection multivision if it does not already exist
mongoose.connect('mongodb://localhost/multivision');
//var to refer to mongoose connection
var db = mongoose.connection;
//listen to events on mongodb db
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('multivision db opened');
});

//creating schema
var mongooseSchema = mongoose.Schema({
    message: String
});
//create a model based on schema
var Message = mongoose.model('Message', mongooseSchema);
//to hold data fetched from db
var mongoMessage;
// returns first record and exec for callback function
Message.findOne().exec(function(err, messageDoc) {

    console.log("inside findone:" + messageDoc);
    mongoMessage = messageDoc.message;
});
// mongoMessage = messageDoc.messageDoc;
// now give this data object to an index view

//for eg. /partials/main will look in the views directory and will render this
app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' + req.params.partialPath);
});

//setting a route to index page
// root route
// app.get('/');
//for any request - default route, then client side routing will kick in and generate the view(eg: a 404 page, but sometimes angular may not find routes, so you can )

app.get('/test', function(req, res) {
    /*res.render('index.html', {
    mongoMessage: mongoMessage.messageDoc
});
*/
    res.json(mongoMessage);
    console.log(mongoMessage);
});


var port = 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');
