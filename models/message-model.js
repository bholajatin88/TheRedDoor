var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema(
    {
        customer_name:{type:String, required: [true, 'Name is required']},
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
        message:{type:String, required: [true, 'Message is required']}
    }
);

mongoose.model('messages', MessageSchema);