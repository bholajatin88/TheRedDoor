var mongoose = require('mongoose'), User = mongoose.model('user'), Address = mongoose.model('addresses');
var { GetItemFromStore, RemoveItemFromStore, SetItemInStore } = require('../common/store');
var addressController = require('./address-controller');
var { GetBaseInitial } = require('../common/util');
const url = require('url');

module.exports={
    Login: function(req, res) {
        var body = req.body;
        var username = body.username.trim();
        User.find({
            $or: [
                {
                  username: username
                },
                {
                  email: username
                }
            ],
            password: body.password.trim()
        }, function(err, results) {
            if(err) {
                throw err;
            } else {
                if(results && results.length > 0) {
                    SetItemInStore(req, "userDetails", JSON.stringify(results[0]));
                    let queryObject = {};
                    if(body.search) {
                        queryObject = url.parse(req.body.search, true).query;
                    }
                    if(queryObject && queryObject.back) {
                        res.redirect(queryObject.back);
                    } else {
                        res.render('home.ejs', GetBaseInitial(req));
                    }
                } else {
                    res.render('login.ejs', {error: "Invalid login username or password"});
                }
            }
        }).collation( { locale: 'en', strength: 1 })
    },
    Register: function(req, res) {
        var body = req.body;
        var username = body.username.trim();
        var email = body.email.trim()
        User.find({
            $or: [
                {
                  username: username
                },
                {
                  email: email
                }
              ]
        }, function(err, results) {
            if(err) {
                throw err;
            } else {
                if(results && results.length > 0) {
                    res.render('register.ejs', {error: {invalidUsername: "Login Username or Email already exists"}, edit: false, form: body}); 
                } else {
                    let address = {
                        street: body.street.trim(),
                        address_line_2: body.address_line_2.trim(),
                        zip: body.postalCode.trim(),
                        city: body.city.trim(),
                        state: body.state.trim()
                    }
                    Address.create(address)
                    .then(function(newAddress) {
                        let address_id = newAddress._id;
                        let user = {
                            username: username,
                            email: email,
                            phone: body.phone.trim(),
                            password: body.password.trim(),
                            address_id: address_id
                        };
                        User.create(user)
                        .then(function(newUser) {
                            SetItemInStore(req, "userDetails", JSON.stringify(newUser));
                            res.render('home.ejs', GetBaseInitial(req));
                        })
                        .catch(function(err) {
                            Address.deleteOne({_id: { $eq: address_id }})
                            .catch(function(error) {
                                throw error;
                            });           
                            if (err.name == 'ValidationError') {
                                res.render('register.ejs', {error: err.errors, edit: false, form: body});
                            } else {
                                throw err;
                            }
                        });
                    })
                    .catch(function(err) {
                        if (err.name == 'ValidationError') {
                            res.render('register.ejs', {error: err.errors, edit: false, form: body});
                        } else {
                            throw err;
                        }
                    });
                }
            }
        }).collation( { locale: 'en', strength: 1 })
    },
    UpdateUser: function(req, res) {
        var body = req.body;
        var username = body.username.trim();
        var email = body.email.trim()
        User.find({
            $or: [
                {
                  username: username
                },
                {
                  email: email
                }
              ]
        }, function(err, results) {
            if(err) {
                throw err;
            } else {
                if(results && results.length > 0) {
                    res.render('editProfile.ejs', {error: {invalidUsername: "Login Username or Email already exists."}, edit: true, form: body}); 
                } else {
                    let address = {
                        street: body.street.trim(),
                        address_line_2: body.address_line_2.trim(),
                        zip: body.postalCode.trim(),
                        city: body.city.trim(),
                        state: body.state.trim()
                    }
                    var result = JSON.parse(GetItemFromStore(req, "userDetails"));
                    Address.updateOne({_id: {$eq: result.address_id}},address).collation( { locale: 'en', strength: 1 })
                    .then(function(newAddress) {
                        let user = {
                            username: username,
                            email: email,
                            phone: body.phone.trim(),
                            password: body.password.trim(),
                            address_id: result.address_id
                        };
                        User.updateOne({_id: {$eq: result._id}},user).collation( { locale: 'en', strength: 1 })
                        .then(function(newUser) {
                            RemoveItemFromStore(req, "userDetails");
                            SetItemInStore(req, "userDetails", JSON.stringify(user));
                            res.render('home.ejs', GetBaseInitial(req));
                        })
                        .catch(function(err) {
                            if (err.name == 'ValidationError') {
                                res.render('editProfile.ejs', {error: err, edit: true, form: body});
                            } else {
                                throw err;
                            }
                        });
                    })
                    .catch(function(err) {
                        if (err.name == 'ValidationError') {
                            res.render('editProfile.ejs', {error: err.errors, edit: true, form: body});
                        } else {
                            throw err;
                        }
                    });
                }
            }
        }).collation( { locale: 'en', strength: 1 })
    },
    getProfile: function(req, res) {
        let userDetails = JSON.parse(GetItemFromStore(req, "userDetails"));
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
            let registerInitial = GetBaseInitial(req);
            registerInitial["error"] = false;
            registerInitial["form"] = userDetails? userDetails : false;
            res.render('editProfile.ejs', registerInitial);
        }).catch(function(err) {
            throw err;
        });
    }
}