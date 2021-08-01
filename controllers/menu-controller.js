var mongoose = require('mongoose'), Menu = mongoose.model('menus');
var { GetBaseInitial } = require('../common/util');

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
                let italian_dishes = result.filter(cuisine=>cuisine.cuisine_type=="Italian");
                let chinese_dishes = result.filter(cuisine=>cuisine.cuisine_type=="Chinese");
                let dessert_dishes = result.filter(cuisine=>cuisine.cuisine_type=="Desserts");
                var userInitial = GetBaseInitial(req);
                userInitial.italian_dishes = italian_dishes;
                userInitial.chinese_dishes = chinese_dishes;
                userInitial.dessert_dishes = dessert_dishes;
                res.render("foodMenu.ejs",userInitial);
            }
            
        });
    }
}