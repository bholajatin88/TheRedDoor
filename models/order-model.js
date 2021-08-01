var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema(
    {
        user_id:{type:mongoose.Schema.Types.ObjectId},
        order_items:{type:Array},
        order_date_time:{type:Date},
        order_total:{type:Number},
        payment_id:{type:mongoose.Schema.Types.ObjectId}
    }
);

mongoose.model('orders', orderSchema);