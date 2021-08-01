const express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var {Store, RemoveItemFromStore} = require('./common/store');
const port = 80;
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('./models/address-model');
require('./models/user-model');
var userController = require('./controllers/user-controller');
require('./models/menu-model');
var menuController = require('./controllers/menu-controller');
var DbConnect = require('./models/common/db-connect').DbConnect;
var { GetBaseInitial, UpdateCart } = require('./common/util');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//common file to create db connection
DbConnect();
Store(app);

app.get('/home', function(req, res) {
    res.render('home.ejs', GetBaseInitial(req));
});

app.get('/', function(req, res) {
    res.render('home.ejs', GetBaseInitial(req));
});

app.get('/login', function(req, res) {
    let initial = GetBaseInitial(req);
    initial["error"] = false;
    res.render('login.ejs', initial);
});

app.get('/register', function(req, res) {
    let registerInitial = GetBaseInitial(req);
    registerInitial["error"] = false;
    registerInitial["form"] = false;
    registerInitial["edit"] = false;
    res.render('register.ejs', registerInitial);
});

app.get('/editprofile', userController.getProfile);

app.get('/menu', menuController.GetAllMenuItems);

app.get('/contact', function(req, res) {
    res.render('contact.ejs', GetBaseInitial(req));
});

app.get('/about', function(req, res) {
    res.render('about.ejs', GetBaseInitial(req));
});

app.get('/logout', function(req, res) {
    RemoveItemFromStore(req,"userDetails");
    res.render('home.ejs', GetBaseInitial(req));
});

app.post('/login', userController.Login);
app.post('/register', function(req, res) {
    if(req.body.updateProfile == 'true') {
        userController.UpdateUser(req, res);
    } else {
        userController.Register(req, res);
    }
});

app.post('/addItemToCart',function(req, res) {
    UpdateCart(req);
    res.render('cart.ejs', GetBaseInitial(req));
});

app.get('/checkout', function(req, res) {
    let initial = GetBaseInitial(req);
    res.render('checkout.ejs', initial);
});

// middleware to catch exceptions
app.use(function(error, req, res, next) {
    console.error(error);
    res.status(500).render('error.ejs');
});

// middleware to catch non-existing routes
app.use(function(req, res, next) {
    res.status(404).render('not-found.ejs');
});

app.listen(port, () => {
    console.log(`TheRedDoor app listening at http://localhost:${port}`)
});