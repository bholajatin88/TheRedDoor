var mongoose = require('mongoose'), ContactMessage = mongoose.model('contactMessages');
var GetBaseInitial = require('../common/util').GetBaseInitial;

module.exports={
    CreateContactMessage: function(req, res) {
        var body = req.body;
        let msg = {
            customer_name: body.name.trim(),
            email: body.email.trim(),
            message: body.message.trim()
        };
        ContactMessage.create(msg)
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