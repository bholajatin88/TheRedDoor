var mongoose = require('mongoose'), Payment = mongoose.model('payments');

module.exports={
    GetPayment: function(order_id) {
        return Payment.find({
            _id: order_id[0]
        });
    },

    AddPayment: function(payment_method){
        return Payment.create({ payment_type: payment_method });
        
    }

}