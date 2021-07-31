var mongoose = require('mongoose'), Menu = mongoose.model('menus');
var SetItemInStore = require('../common/store').SetItemInStore;
var GetUserInitial = require('../common/util').GetUserInitial;

module.exports={
    GetMenuItem: function(menu_id) {
        return Menu.find({
            _id: menu_id[0]
        });
    },

    GetAllMenuItems: function(req, res){
        Menu.find({},function(err, result){
            if(err) { throw err;}
            else{
                var urerInitial = GetUserInitial();
                urerInitial.menu_items = result;
                res.render("foodMenu.ejs",urerInitial);
            }
            
        });
    }
}