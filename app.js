const express = require('express');
const methodOverride = require('method-override');
var path = require('path');
var favicon = require('serve-favicon');
var {Store, RemoveItemFromStore} = require('./common/store');
const port = 80;
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(methodOverride('_method'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('./models/address-model');
require('./models/user-model');
var userController = require('./controllers/user-controller');
require('./models/menu-model');
var menuController = require('./controllers/menu-controller');
require('./models/payment-model');
var paymentController = require('./controllers/payment-controller');
require('./models/order-model');
var orderController = require('./controllers/order-controller');
require('./models/message-model');
var contactController = require('./controllers/message-controller');
var DbConnect = require('./models/common/db-connect').DbConnect;
var { GetBaseInitial, UpdateCart, GetCartTotal, 
    GetAddressId, CreateOrder, EmptyCart, RemoveItem } = require('./common/util');
const addressController = require('./controllers/address-controller');
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
    res.render('register.ejs', registerInitial);
});

app.get('/editProfile', userController.getProfile);

app.put('/editProfile', userController.UpdateUser);

app.get('/menu', menuController.GetAllMenuItems);

app.get('/contact', function(req, res) {
    let initial = GetBaseInitial(req);
    initial["error"] = false;
    initial["form"] = false;
    initial["success"] = false;
    res.render('contact.ejs', initial);
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
    userController.Register(req, res);
});

app.post('/contact', contactController.CreateMessage)

app.post('/addItemToCart',function(req, res) {
    UpdateCart(req);
    res.render('cart.ejs', GetBaseInitial(req));
});

app.put('/updateAddress', function(req, res){
    addressController.UpdateAddress(req,res);  
});

app.get('/checkout', function(req, res) {
    let initial = GetBaseInitial(req);
    let addressId = GetAddressId(req);
    let cartTotal = GetCartTotal(initial.cartItems);
    initial["cart_total"] = cartTotal;
    if(addressId){
        var addressDetails;
        addressController.GetAddress(addressId).then(function(userAddress) {
            if(userAddress) {
                addressDetails = userAddress[0];
            }
            initial["address_details"] = addressDetails;
            initial["error"] = false;
                    
            res.render('checkout.ejs', initial);
        });   
    }
    else{
        initial["address_details"] = null;
        initial["error"] = false;
        res.render('checkout.ejs', initial);
    }
});

app.post("/placeOrder", function(req,res){
    paymentController.AddPayment(req.body["payment.type"]).then(payment=>{
        let order = CreateOrder(req, payment._id);
        orderController.AddOrder(order).then(function(order){
            EmptyCart(req);
            res.redirect('/orderDetails');
            
        }).catch(function(err){
            throw err;
        });
    }).catch(function(err) {
        if (err.name == 'ValidationError') {
            let initial = GetBaseInitial(req);
            let addressId = GetAddressId(req);
            let cartTotal = GetCartTotal(initial.cartItems);
            initial["cart_total"] = cartTotal;
            if(addressId){
                var addressDetails;
                addressController.GetAddress(addressId).then(function(userAddress) {
                    if(userAddress) {
                        addressDetails = userAddress[0];
                    }
                    initial["address_details"] = addressDetails;
                    initial["error"] = err.errors;
                    res.render('checkout.ejs', initial);
                });   
            }
        } else {
            throw err;
        }
    });
    
});

app.get("/orderDetails", function(req,res){
    orderController.GetAllOrders(req,res);
});

app.delete("/deleteOrder", function(req,res){
    orderController.DeleteOrder(req,res);
});

app.put('/removeItem', function(req, res) {
    RemoveItem(req, res);
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