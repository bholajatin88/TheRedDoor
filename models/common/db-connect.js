var mongoose = require('mongoose');
const db_URL = "mongodb+srv://kriti269:lambton@cluster0.kf7ej.mongodb.net/TheRedDoor?retryWrites=true&w=majority";

module.exports.DbConnect = () => {
    try {
        mongoose.connect(db_URL, {useUnifiedTopology: true, useNewUrlParser: true}, function(){
            console.log('connected to the database');
        });
    } catch (e) {
        console.log('Error while connecting to database');
        throw e;
    }
}