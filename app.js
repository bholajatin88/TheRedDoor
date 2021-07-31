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
require('./models/menu-model');
var userController = require('./controllers/user-controller');
var addressController = require('./controllers/address-controller');
var menuController = require('./controllers/menu-controller');
var DbConnect = require('./models/common/db-connect').DbConnect;
var GetUserInitial = require('./common/util').GetUserInitial;
var GetItemFromStore = require('./common/store').GetItemFromStore;
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//common file to create db connection
DbConnect();
Store();

app.get('/home', function(req, res) {
    res.render('home.ejs', GetUserInitial());
});

app.get('/', function(req, res) {
    res.render('home.ejs', GetUserInitial());
});

app.get('/login', function(req, res) {
    let loginInitial = GetUserInitial();
    loginInitial["error"] = false;
    res.render('login.ejs', loginInitial);
});

app.get('/register', function(req, res) {
    let registerInitial = GetUserInitial();
    registerInitial["error"] = false;
    registerInitial["form"] = false;
    registerInitial["edit"] = false;
    res.render('register.ejs', registerInitial);
});

app.get('/editprofile', function(req, res) {
    let userDetails = JSON.parse(GetItemFromStore("userDetails"));
    addressController.GetAddress(userDetails.address_id).then(function(userAddress) {
        if(userAddress) {
            let address = {
                street: userAddress[0].street,
                address_line_2: userAddress[0].address_line_2,
                postalCode: userAddress[0].zip,
                city: userAddress[0].city,
                state: userAddress[0].state
            }
            for (const [key, value] of Object.entries(address)) {
                userDetails[key] = value;
            }
        } else {
            console.log('Error while updating address');
            throw exception;
        }
        let registerInitial = GetUserInitial();
        registerInitial["error"] = false;
        registerInitial["edit"] = true;
        registerInitial["form"] = userDetails? userDetails : false;
        res.render('register.ejs', registerInitial);
    }).catch(function(err) {
        throw err;
    });
});

app.get('/menu', function(req, res) {
    let details = GetUserInitial();
    console.log(details);
    menu_items = menuController.GetAllMenuItems(req,res,details);      
    res.render('foodMenu.ejs', details);
});

app.get('/contact', function(req, res) {
    res.render('contact.ejs', GetUserInitial());
});

app.get('/about', function(req, res) {
    res.render('about.ejs', GetUserInitial());
});

app.get('/logout', function(req, res) {
    RemoveItemFromStore("userDetails");
    res.render('home.ejs', GetUserInitial());
});

app.post('/login', userController.Login);
app.post('/register', function(req, res) {
    if(req.body.updateProfile == 'true') {
        userController.UpdateUser(req, res);
    } else {
        userController.Register(req, res);
    }
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