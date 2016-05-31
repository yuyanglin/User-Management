var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    id: Number,
    fName: String,
    lName: String,
    title: String,
    sex: String,
    age: Number
});

module.exports = mongoose.model('Users', UsersSchema);