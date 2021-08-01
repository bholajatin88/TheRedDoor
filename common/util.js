var GetItemFromStore = require('./store').GetItemFromStore;

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
    let initial = this.GetUserInitial(req);
    initial["cartItems"] = cartItems;
    return initial;
}
