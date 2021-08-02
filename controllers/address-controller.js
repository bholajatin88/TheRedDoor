var mongoose = require('mongoose'), Address = mongoose.model('addresses');
var GetBaseInitial = require("../common/util").GetBaseInitial;

module.exports={
    GetAddress: function(address_id) {
        if(typeof(address_id) === 'string')
        {
            address_id = mongoose.Types.ObjectId(address_id);
        }
        return Address.find({
            _id: address_id[0]
        });
    },

    UpdateAddress: function(req, res){
        let addressDetails = req.body;
        let address_id = mongoose.Types.ObjectId(addressDetails._id);
        Address.updateOne({_id: {$eq: address_id}},addressDetails).then(function(newAddress){
            let initial = GetBaseInitial(req);
            initial["address_details"] = addressDetails;
            res.render('address.ejs', initial);
        });
    }
}