var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.aaj.isLoggedIn){
        res.render('successLogin', { title: 'Dropbox - User Registration' });
    }else{
    res.render('sign_up', { title: 'Dropbox - User Registration' });
    }
});

/* GET signup page. */
router.get('/sign_up', function(req, res, next) {
    if (req.aaj.isLoggedIn){
        res.render('successLogin', { title: 'Dropbox - User Registration' });
    }else{
        res.render('sign_up', { title: 'Dropbox - User Registration' });
    }
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    if (req.aaj.isLoggedIn){
        res.render('successLogin', { title: 'Dropbox - User Registration' });
    }else{
        res.render('signin', { title: 'Login' });
    }
});


module.exports = router;
