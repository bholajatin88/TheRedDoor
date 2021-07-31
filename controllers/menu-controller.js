var mongoose = require('mongoose'), Menu = mongoose.model('menus');
var SetItemInStore = require('../common/store').SetItemInStore;
var GetInitial = require('../common/util').GetInitial;

module.exports={
    GetMenuItem: function(menu_id) {
        return Menu.find({
            _id: menu_id[0]
        });
    },

    GetAllMenuItems: function(req, res){
        Menu.find({},function(err, result){
            if(err) {console.log(err); throw err;}
            else{
                
                console.log(result.length);

                res.render("foodMenu.ejs",{menu_items:result});
            }
            
        });
    }
}