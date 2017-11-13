var express = require('express');
var passport = require('passport');
require('./config/passport')(passport);

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var dropboxController = require('./routes/dropboxController');
var session = require('client-sessions');
var cors = require("cors");
var multer = require("multer");
var db = require('./config/db');
var app = express();

var mongoSessionURL = "mongodb://localhost:27017/dropbox";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo")(expressSessions);

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


//Enable CORS
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/registerUser', dropboxController.registerUser);
app.post('/checkLogin', dropboxController.validateLogin);
app.post('/logout', dropboxController.logout);
app.post('/fileUpload', dropboxController.fileUpload);
app.post('/listFiles', dropboxController.listFiles);
app.post('/makeDirectory', dropboxController.makeDirectory);
app.post('/setUploadPath', dropboxController.setUploadPath);
app.post('/share', dropboxController.doShare);
app.post('/getUserDetails', dropboxController.userDetFetch);
app.post('/userdata', dropboxController.userdata);
app.post('/starFile', dropboxController.starFile);
app.post('/createGroup', dropboxController.createGroup);
app.post('/addMembersToGroup', dropboxController.addMemberstoGroup);
app.post('/shareFilesToGroup', dropboxController.shareFilestoGroup);
app.post('/listUserGroups', dropboxController.listUserGroup);
app.post('/listGroupFiles', dropboxController.listGroupFiles);
app.post('/selectGroup', dropboxController.setGroup);
app.post('/listGroupMembers', dropboxController.listGroupMembers);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
