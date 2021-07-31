var mongoose = require('mongoose'), User = mongoose.model('user'), Address = mongoose.model('addresses');
var { GetItemFromStore, RemoveItemFromStore, SetItemInStore } = require('../common/store');
var GetInitial = require('../common/util').GetInitial;

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
                    SetItemInStore("userDetails", JSON.stringify(results[0]));
                    res.render('home.ejs', {userInitial: GetInitial(results[0])});
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
                            SetItemInStore("userDetails", JSON.stringify(newUser));
                            res.render('home.ejs', {userInitial: GetInitial(newUser)});
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
                    res.render('register.ejs', {error: {invalidUsername: "Login Username or Email already exists."}, edit: true, form: body}); 
                } else {
                    let address = {
                        street: body.street.trim(),
                        address_line_2: body.address_line_2.trim(),
                        zip: body.postalCode.trim(),
                        city: body.city.trim(),
                        state: body.state.trim()
                    }
                    var result = JSON.parse(GetItemFromStore("userDetails"));
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
                            RemoveItemFromStore("userDetails");
                            SetItemInStore("userDetails", JSON.stringify(user));
                            res.render('home.ejs', {userInitial: GetInitial(user)});
                        })
                        .catch(function(err) {
                            if (err.name == 'ValidationError') {
                                res.render('register.ejs', {error: err, edit: true, form: body});
                            } else {
                                throw err;
                            }
                        });
                    })
                    .catch(function(err) {
                        if (err.name == 'ValidationError') {
                            res.render('register.ejs', {error: err.errors, edit: true, form: body});
                        } else {
                            throw err;
                        }
                    });
                }
            }
        }).collation( { locale: 'en', strength: 1 })
    }
}