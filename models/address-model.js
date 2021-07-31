var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema(
    {
        street:{type:String, required: [true, 'street is required']},
        address_line_2:{type:String},
        zip:{type:String, required: [true, 'Postal Code is required']},
        city:{type:String, required: [true, 'city is required']},
        state:{type:String, required: [true, 'state is required']},
    }
);

mongoose.model('addresses', addressSchema);