var mongoose = require('mongoose'), Address = mongoose.model('addresses');
var SetItemInStore = require('../common/store').SetItemInStore;
var GetInitial = require('../common/util').GetInitial;

module.exports={
    GetAddress: function(address_id) {
        return Address.find({
            _id: address_id[0]
        });
    }
}