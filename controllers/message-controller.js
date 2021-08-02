var mongoose = require('mongoose'), Message = mongoose.model('messages');
var GetBaseInitial = require('../common/util').GetBaseInitial;

module.exports={
    CreateMessage: function(req, res) {
        var body = req.body;
        let msg = {
            customer_name: body.name.trim(),
            email: body.email.trim(),
            message: body.message.trim()
        };
        Message.create(msg)
        .then(function(newMessage) {
            let initial = GetBaseInitial(req);
            initial["error"] = false;
            initial["form"] = false;
            initial["success"] = true;
            res.render('contact.ejs', initial);
        })
        .catch(function(err) {
            if (err.name == 'ValidationError') {
                let initial = GetBaseInitial(req);
                initial["error"] = err.errors;
                initial["form"] = body;
                initial["success"] = false;
                res.render('contact.ejs', initial);
            } else {
                throw err;
            }
        });
    }
}