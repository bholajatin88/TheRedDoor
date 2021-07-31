var mongoose = require('mongoose');

var menuSchema = new mongoose.Schema(
    {
        item_name:{type:String},
        item_description:{type:String},
        item_price:{type:Number},
        is_chef_special:{type:Boolean},
        spice_level:{type:Number},
        cuisine_type:{type:String}
    }
);

mongoose.model('menus', menuSchema);