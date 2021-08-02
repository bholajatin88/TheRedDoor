var { GetItemFromStore, SetItemInStore, GetBaseInitial, RemoveItemFromStore } = require('./store');

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

module.exports.CreateOrder = (req, payment_id) => {
    let paymentId = payment_id;
    let userDetails = JSON.parse(GetItemFromStore(req, "userDetails"));
    let cartItems = JSON.parse(GetItemFromStore(req, "cart"));
    let cartTotal = this.GetCartTotal(cartItems);
    let order = {
        user_id: userDetails._id,
        order_items: cartItems,
        order_date_time:new Date(),
        order_total: cartTotal,
        payment_id: paymentId
    }
    return order;
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
    selectedItem["total_price"] = (Math.round(parseFloat(selectedItem["total_price"]) * 100)/100).toString();
    cartItems.push(selectedItem);
    SetItemInStore(req, "cart", JSON.stringify(cartItems));
}

module.exports.RemoveItem = (req, res) => {
    let initial = this.GetBaseInitial(req);
    initial["cartItems"] = initial["cartItems"].filter((item, index) => index != parseInt(req.body.index));
    SetItemInStore(req, "cart", JSON.stringify(initial.cartItems));
    let cartTotal = this.GetCartTotal(initial.cartItems);
    initial["cart_total"] = cartTotal;
    res.render('checkout-cart.ejs', initial);
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


module.exports.GetCartTotal = (cartItems) =>{
    let cartTotal = 0;
    if(cartItems && cartItems.length > 0) {
        cartItems.forEach(cartItem => {
            cartTotal += parseFloat(cartItem.total_price);
        });
    }
    return cartTotal;
}

module.exports.GetAddressId = (req) =>{
    let userDetails = JSON.parse(GetItemFromStore(req, "userDetails"));
    if(userDetails)
        return userDetails.address_id;
}

module.exports.GetUserId = (req) =>{
    let userId = JSON.parse(GetItemFromStore(req, "userDetails"))._id;
    return userId;
}

module.exports.EmptyCart = (req) =>{
    RemoveItemFromStore(req, 'cart');
}