var mongoose = require('mongoose'), Order = mongoose.model('orders');
var menuController = require('../controllers/menu-controller');
var SetItemInStore = require('../common/store').SetItemInStore;
var GetUserInitial = require('../common/util').GetUserInitial;

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
                console.log(orderDetails);
                var userInitial = GetUserInitial(req);
                res.render("orderDetails.ejs",userInitial);
            }
            
        });
    }
}