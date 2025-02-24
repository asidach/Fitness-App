var express = require('express');
var router = express.Router();

var userroutes = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// routes to check user-entered parameters
router.post('/checkemail', userroutes.emailCheck);


module.exports = router;
