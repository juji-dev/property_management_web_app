var mongoose = require( 'mongoose' );

var webpost =new mongoose.Schema({
    type : String,
    title : String,
    description : String,
    image : String,
    dateEntered : Date,
    isSet: Boolean
});

mongoose.model('webpost', webpost);
