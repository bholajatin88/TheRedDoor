var mongoose = require('mongoose'), Address = mongoose.model('addresses');

module.exports={
    GetAddress: function(address_id) {
        return Address.find({
            _id: address_id[0]
        });
    }
}