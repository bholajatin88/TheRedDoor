var mongoose = require('mongoose');

var paymentSchema = new mongoose.Schema(
    {
        payment_type:{type: String, required:[true, "Payment method is required"]}
    }
);

mongoose.model('payments', paymentSchema);