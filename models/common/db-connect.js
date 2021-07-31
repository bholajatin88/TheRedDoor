var mongoose = require('mongoose');
const db_URL = "mongodb://localhost:27017/TheRedDoor";

module.exports.DbConnect = () => {
    try {
        mongoose.connect(db_URL, {useUnifiedTopology: true, useNewUrlParser: true}, function(){
            console.log('connceted to the database');
        });
    } catch (e) {
        console.log('Error while connecting to database');
        throw e;
    }
}