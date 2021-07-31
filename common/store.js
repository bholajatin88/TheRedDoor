var session = require('express-session');

module.exports.Store = (app) => {
    try {
        app.set('trust proxy', 1)
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }));
    } catch (e) {
        console.log('Error while creating session storage');
        throw e;
    }
}

module.exports.SetItemInStore = (req, key, value) => {
    try {
        req.session[key] = value;
        req.session.save();
        return 'success';
    } catch (e) {
        console.log('Error while adding item in session storage');
        throw e;
    }
}

module.exports.GetItemFromStore = (req, key) => {
    try {
        if(req.session && req.session[key]) {
            return req.session[key];
        }
        return null;
    } catch (e) {
        console.log('Error while getting item from session storage');
        throw e;
    }
}

module.exports.RemoveItemFromStore = (req, key) => {
    try {
        req.session[key] = null;
        req.session.save();
        return 'success';
    } catch (e) {
        console.log('Error while removing item from session storage');
    }
}