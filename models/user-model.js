var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required']
        },
        email: {
            type: String,
            validate: {
                validator: function(v) {
                    var re =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return (v == null || v.trim().length < 1) || re.test(v)
                },
                message: 'Provided email is invalid.'
            }
        },
        phone: {
            type: String,
            validate: {
                validator: function(v) {
                    var re = /^\d{10}$/;
                    return (v == null || v.trim().length < 1) || re.test(v)
                },
                message: 'Provided phone number is invalid.'
            }
        },
        password: {
            type: String,
            validate: {
                validator: function(v) {
                    var re = /^([a-zA-Z0-9@*#]{8,15})$/;
                    return (v == null || v.trim().length < 1) || re.test(v)
                },
                message: 'Provided password is invalid. Password must consists of at least 8 characters and not more than 15 characters. Password must be strong.'
            }
        },
        address_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'addresses' }]
    }
);
mongoose.model('user',userSchema);