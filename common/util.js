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
    var GetItemFromStore = require('./store').GetItemFromStore;
    var userDetails = JSON.parse(GetItemFromStore(req, "userDetails"));
    return { userInitial: this.GetInitial(userDetails) };
}
