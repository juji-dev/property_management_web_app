var mongoose = require('mongoose');
var webpost = mongoose.model('webpost');
var property = mongoose.model('property');

var propertyHTML = "<a href=\"property?_id=_ID_\"><div class=\"card mx-auto col-sm-6 bg-dark\" ><div class=\"card-header bg-dark\" style=\"color:white;\" ><h3>_TITLE_<\/h3><\/div><img class=\"card-img-top\" src=\"_IMG_\" style=\"max-width:400px;max-height:auto;\"  alt=\"Card image cap\"><div class=\"card-body bg-dark\"><h4 class=\"card-text\"  style=\"color:white;\">🛏 _BED_   🛁 _BATH_    💵_PRICE_    <\/h4><\/div><\/div></a>"
var individualPropertyHTML = "<div class=\"card mx-auto col-sm-6 bg-dark\" style=\"color:white;\"><h2>_TITLE_<\/h2><img src=\"uploads\/_IMG_\"  class=\"center\" alt=\"Property Image\"><p class=\"card-text\">_DESCRIPTION_<\/p><h5><table style=\"margin-left:auto; margin-right:auto;\"><tr><th>_PRICE_<\/th><th>_ISRENT_<\/th><th>_ISCOMP_<\/th><\/tr><tr><th>_SQFT_<\/th><th>_ISCOMMER_<\/th><th>_LOC_<\/th><\/tr><tr><th>_BED_<\/th><th>_BATH_<\/th><th>_AVAIL_<\/th><\/tr><tr><th>_LEASE_<\/th><th>_PARK_<\/th><th>_FURNI_<\/th><\/tr><tr><th>_GARDEN_<\/th><th>_HEAT_<\/th><th>_WCHAIR_<\/th><\/tr><tr><th>_ISNET_<\/th><th>_ISPATIO_<\/th><th>_SERVICE_<\/th><\/tr><\/table><\/h5><\/div>";

const searchProperties = function (req, res) {
    var isRentalBody = req.body.isRental === true || req.body.isRental === 'true' ? true : false;
    var maxPrice = getMaxPrice(parseInt(req.body.MaxPrice), isRentalBody);
    var minPrice = getMinPrice(parseInt(req.body.MinPrice), isRentalBody);
    property.find({}, function (error, data) {
        var results = [];
        for (var i = 0; i < data.length; i++) {
            let isRentalData = data[i]['isRental'] === true || data[i]['isRental'] === 'true' ? true : false;

            if (isRentalData != isRentalBody) {
                continue;
            }
            if (!data[i].isLive) {
                continue;
            }
            if (data[i].price > maxPrice) {
                continue;
            }
            if (data[i].price < minPrice) {
                continue;
            }
            if (data[i].bedroomCount < parseInt(req.body.MinBedroom)) {
                continue;
            }
            if (data[i].bathroomCount < parseInt(req.body.MinBathroom)) {
                continue;
            }
            if (req.body.Area.toString().length > 0) {
                if (!data[i].location.toLowerCase().includes(req.body.Area.toLowerCase()))
                    continue;
            }
            results.push(data[i]);
        }
        if (parseInt(req.body.SortBy) === 1 || parseInt(req.body.SortBy) === 2) {
            var prices = [];
            for (var i = 0; i < results.length; i++)
                prices.push(results[i].price)

            prices.sort(function (a, b) { return a - b });
            var sortResults = [];
            var ignoreIndex = [];
            for (var i = 0; i < prices.length; i++) {
                for (var j = 0; j < results.length; j++) {
                    if (!ignoreIndex.includes(j)) {
                        if (prices[i] == results[j].price) {
                            sortResults.push(results[j])
                            ignoreIndex.push(j)
                        }
                    }
                }
            }
            results = parseInt(req.body.SortBy) === 1 ? sortResults : sortResults.reverse();
        }

        var CardHTML = "";
        for (var i = 0; i < results.length; i++) {
            var modifiedHTML = propertyHTML.replace('_TITLE_', results[i].title);
            modifiedHTML = modifiedHTML.replace('_BATH_', results[i].bathroomCount);
            modifiedHTML = modifiedHTML.replace('_IMG_', "uploads/" + results[i].picture);
            modifiedHTML = modifiedHTML.replace('_BED_', results[i].bedroomCount);
            modifiedHTML = modifiedHTML.replace('_PRICE_', results[i].price);
            modifiedHTML = modifiedHTML.replace('_ID_', results[i]._id);
            CardHTML += modifiedHTML + escape("</br>");
        }
        if (isRentalBody)
            return res.render('rent', { title: 'Rent', 'searchResults': CardHTML });
        else
            return res.render('buy', { title: 'Buy', 'searchResults': CardHTML });
    });

};

const getProperty = function (req, res) {
    property.findById({ _id: req.query._id }, function (err, data) {
        let _TITLE_ = data.title != undefined ? (data.title.length > 0 ? data.title.toUpperCase() : "Property not named") : "Property title undefined";
        let _DESCRIPTION_ = "<h3>Description</h3></br>" + (data.description != undefined ? (data.description.length > 0 ? data.description : "Property description is empty") : "Property description is undefined");
        let _PRICE_ = data.price != undefined ? "💵" + data.price : "Price information is undefined";
        let _ISRENT_ = data.isRental ? "Rental property" : "Sale property";
        let _IMG_ = data.picture;
        let _ISCOMP_ = data.isTransactionComplete != undefined ? (data.isTransactionComplete ? "This property listing is closed" : "This property listing is open") : "Transaction information undefined";
        let _SQFT_ = data.sqft != undefined ? "Sqft: " + data.sqft : "Sqft not provided";
        let _ISCOMMER_ = data.isCommercial != undefined ? (data.isCommercial ? "This is a commercial Property" : "This is a residential Property") : "Commercial/Residential property information is Undefined";
        let _LOC_ = data.location != undefined ? (data.location.length > 0 ? data.location : "No recorded location") : "Location data is undefined";
        let _BED_ = data.bedroomCount != undefined ? "🛏" + data.bedroomCount : "Bedroom information is Undefined";
        let _BATH_ = data.bathroomCount != undefined ? "🛁" + data.bathroomCount : "Bathroom information is Undefined";
        let _AVAIL_ = data.availabilityDate != undefined ? "Availability Date: " + data.availabilityDate.toString() : "Availability date information is unknown";
        let _LEASE_ = data.leaseLength != undefined ? (data.isRental ? "Lease Length: " + data.leaseLength : "Sale property, no Lease") : "Lease information is Undefined";
        let _PARK_ = data.fc_isParking != undefined ? (data.fc_isParking ? "Property has parking" : "No parking") : "Parking information is unavailable";
        let _FURNI_ = data.fc_isFurnished != undefined ? (data.fc_isFurnished ? "Property furnished" : "Not Furnished") : "Furniture information is undefined";
        let _GARDEN_ = data.fc_isGarden != undefined ? (data.fc_isGarden ? "Property has garden" : "No garden") : "Garden information is undefined";
        let _HEAT_ = data.fc_isCentralHeating != undefined ? (data.fc_isCentralHeating ? "Property has central heating" : "No central heating") : "Central heating information is undefined";
        let _WCHAIR_ = data.fc_isWheelchairAccess != undefined ? (data.fc_isWheelchairAccess ? "Property has wheelchair access" : "No wheelchair access") : "Wheelchair information is undefined";
        let _ISNET_ = data.fc_isInternetAccess != undefined ? (data.fc_isInternetAccess ? "Property has Internet" : "No Internet") : "Internet information is undefined";
        let _ISPATIO_ = data.fc_isPatio != undefined ? (data.fc_isPatio ? "Property has a Patio" : "No Patio") : "Patio information is undefined";
        let _SERVICE_ = data.fc_isServicedProperty != undefined ? (data.fc_isServicedProperty ? "Property is serviced" : "Property not serviced") : "Service information is undefined";

        let modifiedHTML = individualPropertyHTML.replace('_TITLE_', _TITLE_);
        modifiedHTML = modifiedHTML.replace('_DESCRIPTION_', _DESCRIPTION_);
        modifiedHTML = modifiedHTML.replace('_PRICE_', _PRICE_);
        modifiedHTML = modifiedHTML.replace('_ISRENT_', _ISRENT_);
        modifiedHTML = modifiedHTML.replace('_ISCOMP_', _ISCOMP_);
        modifiedHTML = modifiedHTML.replace('_SQFT_', _SQFT_);
        modifiedHTML = modifiedHTML.replace('_ISCOMMER_', _ISCOMMER_);
        modifiedHTML = modifiedHTML.replace('_LOC_', _LOC_);
        modifiedHTML = modifiedHTML.replace('_BED_', _BED_);
        modifiedHTML = modifiedHTML.replace('_BATH_', _BATH_);
        modifiedHTML = modifiedHTML.replace('_AVAIL_', _AVAIL_);
        modifiedHTML = modifiedHTML.replace('_LEASE_', _LEASE_);
        modifiedHTML = modifiedHTML.replace('_PARK_', _PARK_);
        modifiedHTML = modifiedHTML.replace('_FURNI_', _FURNI_);
        modifiedHTML = modifiedHTML.replace('_GARDEN_', _GARDEN_);
        modifiedHTML = modifiedHTML.replace('_HEAT_', _HEAT_);
        modifiedHTML = modifiedHTML.replace('_WCHAIR_', _WCHAIR_);
        modifiedHTML = modifiedHTML.replace('_ISNET_', _ISNET_);
        modifiedHTML = modifiedHTML.replace('_ISPATIO_', _ISPATIO_);
        modifiedHTML = modifiedHTML.replace('_SERVICE_', _SERVICE_);
        modifiedHTML = modifiedHTML.replace('_IMG_', _IMG_);

        return res.render('property', { title: 'Property', 'property': modifiedHTML });
    });
};

function getMaxPrice(priceData, _isRental) {
    var price;
    switch (priceData) {
        case 1:
            price = _isRental ? 250 : 25000;
            break;
        case 2:
            price = _isRental ? 500 : 50000;
            break;
        case 3:
            price = _isRental ? 750 : 75000;
            break;
        case 4:
            price = _isRental ? 1000 : 100000;
            break;
        case 5:
            price = _isRental ? 1250 : 150000;
            break;
        case 6:
            price = _isRental ? 1500 : 200000;
            break;
        case 7:
            price = _isRental ? 1750 : 300000;
            break;
        case 8:
            price = _isRental ? 2000 : 500000;
            break;
        case 9:
            price = _isRental ? 2500 : 750000;
            break;
        default:
            price = 10000000000;
            break;
    }
    return price
}

function getMinPrice(priceData, _isRental) {
    var price;
    switch (priceData) {
        case 1:
            price = _isRental ? 0 : 0;
            break;
        case 2:
            price = _isRental ? 250 : 25000;
            break;
        case 3:
            price = _isRental ? 500 : 50000;
            break;
        case 4:
            price = _isRental ? 750 : 75000;
            break;
        case 5:
            price = _isRental ? 1000 : 100000;
            break;
        case 6:
            price = _isRental ? 1250 : 150000;
            break;
        case 7:
            price = _isRental ? 1500 : 200000;
            break;
        case 8:
            price = _isRental ? 1750 : 300000;
            break;
        case 9:
            price = _isRental ? 0 : 500000;
            break;
        default:
            price = 0;
            break;
    }
    return price
}

module.exports = {
    searchProperties,
    getProperty
}