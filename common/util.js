var { GetItemFromStore, SetItemInStore } = require('./store');

module.exports.GetInitial = (userDetails) => {
    try {
        let initial = '';
        if(userDetails) {
            let username = userDetails.username;
            if(username) {
                initial = username.substring(0,1).toUpperCase();
            }
        }
        return initial;
    } catch (e) {
        console.log('Error while getting user initial');
        throw e;
    }
}

module.exports.GetUserInitial = (req) => {
    var userDetails = JSON.parse(GetItemFromStore(req, "userDetails"));
    return { userInitial: this.GetInitial(userDetails) };
}

module.exports.GetBaseInitial = (req) => {
    let cartItems = JSON.parse(GetItemFromStore(req, "cart"));
    if(!cartItems) {
        cartItems = [];
    }
    let initial = this.GetUserInitial(req);
    initial["cartItems"] = cartItems;
    initial["cartCount"] = this.GetCartCount(cartItems);
    return initial;
}

module.exports.UpdateCart = (req) => {
let selectedItem = req.body;
    let currentItems = JSON.parse(GetItemFromStore(req, "cart"));
    let cartItems = [];
    if(currentItems) {
        cartItems = [...currentItems];
    }
    cartItems.push(selectedItem);
    SetItemInStore(req, "cart", JSON.stringify(cartItems));
}

module.exports.GetCartCount = (cartItems) => {
    let cartCount = 0;
    if(cartItems && cartItems.length > 0) {
        cartItems.forEach(cartItem => {
            cartCount += parseInt(cartItem.qty);
        });
    }
    return cartCount;
}
