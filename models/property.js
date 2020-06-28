var mongoose = require( 'mongoose' );

var property =new mongoose.Schema({
    isRental : Boolean,
    isTransactionComplete : Boolean,
    sqft : Number,
    isCommercial : Boolean,
    price : Number,
    picture : String,
    description : String,
    location : String,
    bedroomCount : Number,
    bathroomCount : Number,
    availabilityDate : Date,
    leaseLength : Number,
    title : String,
    isLive : Boolean,
    dateEntered : Date,
    fc_isParking : Boolean,
    fc_isFurnished : Boolean,
    fc_isGarden : Boolean,
    fc_isCentralHeating : Boolean,
    fc_isWheelchairAccess : Boolean,
    fc_isInternetAccess : Boolean,
    fc_isPatio : Boolean,
    fc_isServicedProperty : Boolean
});

mongoose.model('property', property);
