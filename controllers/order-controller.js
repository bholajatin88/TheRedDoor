var mongoose = require('mongoose'), Order = mongoose.model('orders');
var menuController = require('../controllers/menu-controller');
var { GetUserInitial, GetBaseInitial, GetAddressId, GetCartTotal } = require('../common/util');

module.exports={
    GetOrder: function(order_id) {
        return Order.find({
            _id: order_id[0]
        });
    },

    GetAllOrders: function(req, res){
        Order.find({user_id:req.params.user_id},function(err, result){
            if(err) { throw err;}
            else{
                let orderDetails = result.forEach(order => 
                    order.order_items.forEach(menu=> {menu=menuController.GetMenuItem(menu._id)}));
                var userInitial = GetUserInitial(req);
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
                        
                res.render('checkout.ejs', initial);
            });
        }
        else{
            initial["address_details"] = null;
            res.render('checkout.ejs', initial);
        }
    }
}