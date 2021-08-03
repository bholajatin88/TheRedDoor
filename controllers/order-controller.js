var mongoose = require('mongoose'), Order = mongoose.model('orders');
var paymentController = require('./payment-controller');
var { GetUserInitial, GetBaseInitial, GetAddressId, GetCartTotal, GetUserId, GetCartCount } = require('../common/util');

module.exports={
    GetOrder: function(order_id) {
        return Order.find({
            _id: order_id[0]
        });
    },

    GetAllOrders: function(req, res){
        let userId = GetUserId(req);
        Order.find({user_id:userId},function(err, result){
            if(err) { throw err;}
            else{
                if(result) {
                    for(let i=0;i<result.length;i++) {
                        result[i]["count"] = GetCartCount(result[i].order_items);
                    }
                }
                var userInitial = GetUserInitial(req);
                userInitial["order_details"] = result;
                res.render("orderDetails.ejs",userInitial);
            }
            
        });
    },

    GetCheckout:  function(req, res) {
        let initial = GetBaseInitial(req);
        let addressId = GetAddressId(req);
        let cartTotal = GetCartTotal(initial.cartItems);
        initial["cart_total"] = cartTotal;
        if(addressId){
            var addressDetails;
            addressController.GetAddress(addressId).then(function(userAddress) {
                if(userAddress) {
                    addressDetails = userAddress[0];
                }
                initial["address_details"] = addressDetails;
                intial["error"] = false;
                res.render('checkout.ejs', initial);
            });
        }
        else{
            initial["address_details"] = null;
            intial["error"] = false;
            res.render('checkout.ejs', initial);
        }
    },

    AddOrder: function(order){
        return Order.create(order);
    },

    DeleteOrder: function(req,res){
        Order.findByIdAndDelete(req.body.order_id,function(err,result){
            if(err) { throw err;}
            else{
                paymentController.DeletePayment(result.payment_id, res);
            }
        });
    }
}