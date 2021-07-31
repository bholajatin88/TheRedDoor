module.exports.Store = () => {
    try {
        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
        }
        localStorage.clear();
    } catch (e) {
        console.log('Error while creating local storage');
        throw e;
    }
}

module.exports.SetItemInStore = (key, value) => {
    try {
            localStorage.setItem(key, value);
            return 'success';
    } catch (e) {
        console.log('Error while adding item in local storage');
        throw e;
    }
}

module.exports.GetItemFromStore = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.log('Error while getting item from local storage');
        throw e;
    }
}

module.exports.RemoveItemFromStore = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.log('Error while removing item from local storage');
    }
}