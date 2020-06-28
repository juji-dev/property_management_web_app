var mongoose = require( 'mongoose' );

var user =new mongoose.Schema({
    pwd : String,
    userName : String,
    firstName : String,
    secondName : String,
    admin : Boolean
});

mongoose.model('user', user);
