var mongoose = require('mongoose');
var user = mongoose.model('user');
var webpost = mongoose.model('webpost');
var property = mongoose.model('property');
const formidable = require('formidable')

const addOfferMenuButton = "<form enctype=\"multipart/form-data\" action=\'\/cms\' method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"text\" value=\"ADD_OFFER\" hidden><button class=\"btn btn-dark\" type=\"submit\">Add Offer<\/button><\/form>";
const offerSetRemove = "<tr><th scope=\"row\">_OFFERS_<\/th><td><\/td><td><form enctype=\"multipart/form-data\" action=\"cms\" method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"hidden\" value=\"READ_OFFER\"><input id=\"_id\" name=\"_id\" type=\"hidden\" value=\"_ID_\"><button class=\"btn btn-dark\" type=\"submit\">View<\/button><\/form><\/td><td><form enctype=\"multipart/form-data\" action=\"cms\" method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"hidden\" value=\"SET_OFFER\"><input id=\"_id\" name=\"_id\" type=\"hidden\" value=\"_ID_\"><button class=\"btn btn-danger\" type=\"submit\">Set home offer<\/button><\/form><\/td><td><form enctype=\"multipart/form-data\" action=\"cms\" method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"hidden\" value=\"REMOVE_OFFER\"><input id=\"_id\" name=\"_id\" type=\"hidden\" value=\"_ID_\"><button class=\"btn btn-danger\" type=\"submit\">Delete<\/button><\/form><\/td><\/tr>";
const addNewsMenuButton = "<form enctype=\"multipart/form-data\" action=\'\/cms\' method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"text\" value=\"ADD_NEWS\" hidden><button class=\"btn btn-dark\" type=\"submit\">Add News<\/button><\/form>";
const newsSetRemove = "<tr><th scope=\"row\">_NEWS_<\/th><td><form enctype=\"multipart\/form-data\" action=\"cms\" method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"hidden\" value=\"READ_NEWS\"><input id=\"_id\" name=\"_id\" type=\"hidden\" value=\"_ID_\"><button class=\"btn btn-dark\" type=\"submit\">View<\/button><\/form><\/td><td><form enctype=\"multipart\/form-data\" action=\"cms\" method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"hidden\" value=\"SET_NEWS\"><input id=\"_id\" name=\"_id\" type=\"hidden\" value=\"_ID_\"><button class=\"btn btn-danger\" type=\"submit\">Set home news<\/button><\/form><\/td><td><form enctype=\"multipart\/form-data\" action=\"cms\" method=\"POST\"><input id=\"postCMS\" name=\"postCMS\" type=\"hidden\" value=\"REMOVE_NEWS\"><input id=\"_id\" name=\"_id\" type=\"hidden\" value=\"_ID_\"><button class=\"btn btn-danger\" type=\"submit\">Delete<\/button><\/form><\/td><\/tr>";
const viewProperties = "<tr><th scope=\"row\">_NAME_<\/th><td><form enctype=\"multipart\/form-data\" action=\"cms\" method=\"POST\"><input name=\"postCMS\" type=\"hidden\" value=\"READ_PROPERTY\" \/> <input name=\"_id\" type=\"hidden\" value=\"_ID_\" \/><button type=\"submit\" class=\"btn btn-dark\" >View<\/button><\/form><\/td><td><form enctype=\"multipart\/form-data\" action=\"cms\" method=\"POST\"><input name=\"postCMS\" type=\"hidden\" value=\"UPDATE_PROPERTY_PAGE\" \/> <input name=\"_id\" type=\"hidden\" value=\"_ID_\" \/> <button class=\"btn btn-dark\" type=\"submit\">Edit<\/button><\/form><\/td><\/tr>";
const updatePropertyPageHTML = "<form enctype=\"multipart/form-data\" action=\'\/cms\' method=\'POST\'><h5>Update Property<\/h5><div class=\"form-group\"><strong>Property Title: _PROPERTYTITLE_ <\/strong><\/div><div class=\"form-group\"><label for=\"description\"><strong>Property Description<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"description\" name=\"description\" value=\"_DESCRIPTION_\"><\/div><div class=\"form-group\"><label for=\"isRental\"><strong>Check if rental, uncheck if sale<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isRental\" _ISRENTAL_  name=\"isRental\"><\/div><div class=\"form-group\"><label for=\"isTransactionComplete\"><strong>Is property rented or sold<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isTransactionComplete\" _TRANSACTION_ name=\"isTransactionComplete\"><\/div><div class=\"form-group\"><label for=\"price\"><strong>Price<\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"price\" value=\"_PRICE_\" name=\"price\"><\/div><div class=\"form-group\"><label for=\"pictures\"><strong>Picture<\/strong><\/label>_IMG_<input type=\"file\" class=\"form-control\" required id=\"pictures\" value=\"_PICTURES_\" name=\"pictures\"><\/div><div class=\"form-group\"><strong>Location: _LOCATION_ <\/strong><\/div><div class=\"form-group\"><strong>Square ft: _SQFT_ <\/strong><\/div><div class=\"form-group\"><strong>Commercial or Residential : _ISCOMMERCIAL_ <\/strong><\/div><div class=\"form-group\"><strong>Bed Count: _BED_ <\/strong><\/div><div class=\"form-group\"><strong>Bath Count: _BATH_ <\/strong><\/div><div class=\"form-group\"><label for=\"availabilityDate\"><strong>Availability date<\/strong><\/label><input type=\"date\" class=\"form-control\" id=\"availabilityDate\" value=\"_AVAIL_\" name=\"availabilityDate\"><\/div><div class=\"form-group\"><label for=\"leaseLength\"><strong>Lease Length (0 if sale property) <\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"leaseLength\" value=\"_LEASE_\" name=\"leaseLength\"><\/div><div class=\"form-group\"><label for=\"isLive\"><strong>Set live in gallery<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isLive\" _ISLIVE_ name=\"isLive\"><\/div><div class=\"form-group\"><strong>Facility Parking: _PARKING_ <\/strong><\/div><div class=\"form-group\"><strong>Facility Furnished: _FURNITURE_ <\/strong><\/div><div class=\"form-group\"><strong>Facility Garden: _GARDEN_ <\/strong><\/div><div class=\"form-group\"><strong>Facility Central Heating: _HEAT_ <\/strong><\/div><div class=\"form-group\"><strong>Facility Wheelchair Accessible: _WHEELCHAIR_ <\/strong><\/div><div class=\"form-group\"><strong>Facility Internet Access: _INTERNET_ <\/strong><\/div><div class=\"form-group\"><strong>Facility has Patio: _PATIO_ <\/strong><\/div><div class=\"form-group\"><strong>Facility is Serviced: _SERVICED_ <\/strong><\/div><input type=\"hidden\" class=\"form-control\" id=\"postCMS\" name=\"postCMS\" value=\"UPDATE_PROPERTY\"><input type=\"hidden\" class=\"form-control\" id=\"_id\" name=\"_id\" value=\"_ID_\"><button type=\"submit\" class=\"btn btn-dark\">Submit<\/button><\/form>";
const addNewsHTML = "<div><h3>Add News<\/h3><\/div><div><form enctype=\"multipart/form-data\" action=\"\/cms\" method=\'POST\'><div class=\"form-group\"><label for=\"newsTitle\"><strong>News Title<\/strong><\/label><\/br><input id=\"newsTitle\" class=\"form-control\" type=\"text\" name=\"newsTitle\" required><\/br><\/div><div class=\"form-group\"><label for=\"newsImage\"><strong>News Image<\/strong><\/label><\/br><input type=\"file\" required class=\"form-control-file\" accept=\"image\/png, image\/jpeg\" id=\"newsImage\" name=\"newsImage\"><\/br><\/div><div class=\"form-group\"><label for=\"newsDescription\"><strong>News Body<\/strong><\/label><\/br><textarea name=\"newsDescription\" class=\"form-control\" id=\"newsDescription\" required>Enter News body here...<\/textarea><\/div><div class=\"form-group\"><input type=\"text\" id=\"postCMS\" name=\"postCMS\" value=\"SUBMIT_NEWS\" hidden><input type=\"text\" id=\"webpostType\" name=\"webpostType\" value=\"News\" hidden><button type=\"submit\" class=\"btn btn-dark mb-2\">Add News</button><\/div><\/form><\/div>";
const addOfferHTML = "<div><h3>Add Offer<\/h3><\/div><div><form enctype=\"multipart/form-data\" action=\"\/cms\" method=\'POST\'><div class=\"form-group\"><label for=\"offerTitle\"><strong>Offer Title<\/strong><\/label><\/br><input id=\"offerTitle\" class=\"form-control\" type=\"text\" name=\"offerTitle\" required><\/br><\/div><div class=\"form-group\"><label for=\"offerBanner\"><strong>Offer Banner<\/strong><\/label><\/br><input type=\"file\" required class=\"form-control-file\" accept=\"image\/png, image\/jpeg\" id=\"offerBanner\" name=\"offerBanner\"><\/br><\/div><div class=\"form-group\"><label for=\"offerDescription\"><strong>Offer Body<\/strong><\/label><\/br><textarea name=\"offerDescription\" class=\"form-control\" id=\"offerDescription\" required>Enter offer here...<\/textarea><\/div><div class=\"form-group\"><input type=\"text\" id=\"postCMS\" name=\"postCMS\" value=\"SUBMIT_OFFER\" hidden><input type=\"text\" id=\"webpostType\" name=\"webpostType\" value=\"Offer\" hidden><button type=\"submit\" class=\"btn btn-dark mb-2\">Add Offer</button><\/div><\/form><\/div>";

const accessCMS = function (req, res) {
    var cookie = req.session.userId;
    var menu = req.query.menu;          // menu - UserManagement=1, RentalProperty=2, SalesProperty=3 
    var subMenu = req.query.subMenu;

    user.findById({ _id: cookie }, function (err, userData) {
        if (err) {
            res.render('login', { title: 'Login', loginMessage: 'Error searching for user' });
        } else {
            if (userData) {
                return CMS(res, userData.userName, userData.admin, menu, subMenu);//res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights : true  });
            } else {
                return res.render('login', { title: 'Login', loginMessage: 'Unauthorized Access Denied' });
            }
        }
    });
}

function CMS(_res, _user, _adminRights, _menu, _subMenu) {
    var CardHTML = "<h3>Select a menu option<\/h3>";
    if (_menu == 1) { //MARKETING
        if (_subMenu == 1) { //NEWS
            //Add news button and list of all news items with set and remove buttons
            var webpostSearch = webpost.find({}, function (error, data) {
                if (error) {
                    //TODO response 
                } else {
                    var CardHTML = "<div><table class=\"table table-bordered table-light\"><thead><tr><th scope=\"col\"><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><\/tr><\/thead><tbody>";
                    var SetNews = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type == "News") {
                            var reducedTitle = data[i].title.length < 40 ? data[i].title: (data[i].title.substring(0,37) + "...");    
                            if (data[i].isSet == true){
                                SetNews = "<h5>CURRENT SET NEWS: " + reducedTitle+ escape("</h5>");
                            }

                            var modifiedHTML = newsSetRemove.replace('_NEWS_', reducedTitle);
                            modifiedHTML = modifiedHTML.replace('_ID_', data[i]._id);
                            modifiedHTML = modifiedHTML.replace('_ID_', data[i]._id);
                            modifiedHTML = modifiedHTML.replace('_ID_', data[i]._id);
                            CardHTML += modifiedHTML;
                        }
                    }
                    CardHTML += escape("</tbody></table></div>");
                    CardHTML = escape("<h4>News</h4>") +addNewsMenuButton + escape("</br>") + SetNews + CardHTML;

                    return _res.render('cms/cms', { title: 'CMS', 'user': _user, 'adminRights': _adminRights, 'cmsRights': true, 'cardInnerHTML': CardHTML });
                }
            });
        }
        else if (_subMenu == 2) { ////OFFERS
            //Add offer button
            //list of all news items with set and remove buttons
            var webpostSearch = webpost.find({}, function (error, data) {
                if (error) {
                    //TODO response 
                } else {
                    var CardHTML = "<table class=\"table table-bordered table-light\"><thead><tr><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><\/tr><\/thead><tbody>";
                    var SetOffer = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type == "Offer") {
                            var reducedTitle = data[i].title.length < 40 ? data[i].title: (data[i].title.substring(0,37) + "...");    
                            if (data[i].isSet == true)
                                SetOffer = "<h4>CURRENT SET OFFER: " + reducedTitle+ escape("</h4>");

                            var modifiedHTML = offerSetRemove.replace('_OFFERS_',reducedTitle);
                            modifiedHTML = modifiedHTML.replace('_ID_', data[i]._id);
                            modifiedHTML = modifiedHTML.replace('_ID_', data[i]._id);
                            modifiedHTML = modifiedHTML.replace('_ID_', data[i]._id);
                            CardHTML += modifiedHTML;
                        }  
                    }
                    CardHTML += escape("</tbody></table>");
                    CardHTML =escape("<h4>Offers</h4>")+ addOfferMenuButton + escape("</br>") + SetOffer + CardHTML;

                    return _res.render('cms/cms', { title: 'CMS', 'user': _user, 'adminRights': _adminRights, 'cmsRights': true, 'cardInnerHTML': CardHTML });
                }
            });
        }
    }
    else if (_menu == 2) { //PROPERTY MANAGEMENT
        if (_subMenu == 1) { //VIEW EDIT SALES PROPERTY
            //view list of all sales properties with edit and view 
            var propertySearch = property.find({}, function (error, data) {
                if (error) {
                    //TODO ERROR RESPONSE
                } else {
                    CardHTML = "<h5>View and Edit Sales Properties<\/h5><table class=\"table table-bordered table-light\"><thead><tr><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><\/tr><\/thead><tbody>";
                    for (var i = 0; i < data.length; i++) {
                        if (!data[i].isRental) {
                            var outputHTML = viewProperties.replace('_NAME_', data[i].title);
                            outputHTML = outputHTML.replace('_ID_', data[i]._id);
                            outputHTML = outputHTML.replace('_ID_', data[i]._id);
                            outputHTML = outputHTML.replace('_ID_', data[i]._id);
                            CardHTML += outputHTML;
                        }
                    }
                    CardHTML += "</tbody></table>";
                    return _res.render('cms/cms', { title: 'CMS', 'user': _user, 'adminRights': _adminRights, 'cmsRights': true, 'cardInnerHTML': CardHTML });
                }
            });
        }
        else if (_subMenu == 2) { //VIEW EDIT RENTAL PROPERTY
            //view list of all rental properties with edit and view 
            var propertySearch = property.find({}, function (error, data) {
                if (error) {
                    //TODO ERROR RESPONSE
                } else {
                    var CardHTML = "<h5>View and Edit Rental Properties<\/h5><table class=\"table table-bordered table-light\"><thead><tr><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><\/tr><\/thead><tbody>";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].isRental) {
                            var outputHTML = viewProperties.replace('_NAME_', data[i].title);
                            outputHTML = outputHTML.replace('_ID_', data[i]._id);
                            outputHTML = outputHTML.replace('_ID_', data[i]._id);
                            outputHTML = outputHTML.replace('_ID_', data[i]._id);
                            CardHTML += outputHTML;
                        }
                    }
                    CardHTML += "</tbody></table>";
                    return _res.render('cms/cms', { title: 'CMS', 'user': _user, 'adminRights': _adminRights, 'cmsRights': true, 'cardInnerHTML': CardHTML });
                }
            });
        }
    }
    else {
        return _res.render('cms/cms', { title: 'CMS', 'user': _user, 'adminRights': _adminRights, 'cmsRights': true, 'cardInnerHTML': CardHTML });
    }
}


const postCmsScreen = function (req, res) {
    var fields = {};
    new formidable.IncomingForm().parse(req)
        .on('fileBegin', (name, file) => {
            var nwdate = Date.now();
            file.path = './public/uploads/' + nwdate + file.name;
            fields['propertyImageUrl'] = nwdate + file.name;
        })
        .on('field', (name, field) => {
            fields[name.toString()] = field;
        })
        .on('file', (name, file) => {
        })
        .on('end', () => {
            req.body = fields;
            return postCMS(req, res);
        })
}

const postCMS = function (req, res) {

    var cookie = req.session.userId;
    user.findById({ _id: cookie }, function (err, userData) {
        if (err) {
            return res.render('login', { title: 'Login', loginMessage: 'Error searching for user' });
        } else {
            if (userData) {
                if (req.body.postCMS == 'ADD_OFFER') {
                    return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: addOfferHTML });
                } else if (req.body.postCMS == 'SUBMIT_OFFER') {
                    try {
                        webpost.find({}, function (error, data) {
                            if (error) {
                                //TODO ErrorMSg
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].title == req.body.offerTitle) {
                                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: ('<strong>Failed - Offer title already exists</strong>') });
                                    }
                                }
                                webpost.findOneAndUpdate({ title: req.body.offerTitle },
                                    {
                                        'title': req.body.offerTitle,
                                        'type': "Offer",
                                        'description': req.body.offerDescription,
                                        'image': req.body.propertyImageUrl,
                                        'dateEntered': new Date(),
                                        'isSet': false
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        setDefaultsOnInsert: true
                                    },
                                    (err, response) => {
                                        if (err) {
                                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: ("<strong>Create offer Failed</strong>") });
                                        } else {
                                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: ("<strong>New Offer Successfully Added</strong>") });
                                        }
                                    });
                            }

                        });

                    } catch (error) {
                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Create Offer Failed</strong>" });
                    }

                } else if (req.body.postCMS == 'READ_OFFER') {
                    try {
                        webpost.findOne({ _id: req.body._id }, (error, response) => {
                            if (error) {
                                return CMS(res, userData.userName, userData.admin, 1, 2);
                            }
                            else {
                                var offerHTML = "<h3>View Offer<\/h3><\/br>" +
                                    "<strong>Title:</strong>\t" + response.title + '<\/br>' +
                                    "<strong>Description:</strong>\t" + response.description + '<\/br>' +
                                    "<strong>Image:</strong>\t" + response.image + '<\/br>' +
                                    "<img src=\"uploads\/" + response.image + "\" style=\"max-width:100px;\" class=\"center\">" + '<\/br>' +
                                    "<strong>Date:</strong>\t" + response.dateEntered + '<\/br>';
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: offerHTML });
                            }
                        });
                    } catch{
                        //TODO ERROR REDIRECT
                    }

                } else if (req.body.postCMS == 'REMOVE_OFFER') {
                    try {
                        webpost.findOneAndDelete({ '_id': req.body._id }, function (error, response) {
                            if (error) {
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: (escape("<strong>") + "Offer Not Deleted</strong>") });
                            } else {
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: (escape("<strong>") + "Offer Successfully Deleted</strong>") });
                            }
                        });
                    } catch (error) {
                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Offer Not Deleted</strong>" });
                    }
                } else if (req.body.postCMS == 'ADD_NEWS') {
                    return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: addNewsHTML });

                } else if (req.body.postCMS == 'SUBMIT_NEWS') {
                    try {
                        webpost.find({}, function (error, data) {
                            if (error) {
                                //TODO ErrorMSg
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].title == req.body.newsTitle) {
                                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: ('<strong>Failed - Webpost title already exists</strong>') });
                                    }
                                }
                                webpost.findOneAndUpdate({ title: req.body.newsTitle },
                                    {
                                        'title': req.body.newsTitle,
                                        'type': "News",
                                        'description':  req.body.newsDescription,
                                        'image': req.body.propertyImageUrl,
                                        'dateEntered': new Date(),
                                        'isSet': false
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        setDefaultsOnInsert: true
                                    },
                                    (err, response) => {
                                        if (err) {
                                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: ("<strong>Create News Failed</strong>") });
                                        } else {
                                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: ("<strong>News Successfully Added</strong>") });
                                        }
                                    });
                            }
                        });

                    } catch (error) {
                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Create News Failed</strong>" });
                    }

                } else if (req.body.postCMS == 'READ_NEWS') {
                    try {
                        webpost.findOne({ _id: req.body._id }, (error, response) => {
                            if (error) {
                                return CMS(res, userData.userName, userData.admin, 1, 2);
                            }
                            else {
                                var newsHTML = "<h3>View News<\/h3><\/br>" +
                                    "<strong>Title:</strong>\t" + response.title + '<\/br>' +
                                    "<strong>Description:</strong>\t" + response.description + '<\/br>' +
                                    "<strong>Image:</strong>\t" + response.image + '<\/br>' +
                                    "<img src=\"uploads\/" + response.image + "\" style=\"max-width:100px;\" class=\"center\">"+ '<\/br>' +
                                    "<strong>Date:</strong>\t" + response.dateEntered + '<\/br>';
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: newsHTML });
                            }
                        });
                    } catch{
                        //TODO ERROR REDIRECT
                    }
                } else if (req.body.postCMS == 'REMOVE_NEWS') {
                    try {
                        webpost.findOneAndDelete({ '_id': req.body._id }, function (error, response) {
                            if (error) {
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: (escape("<strong>")+ "News Not Deleted") });
                            } else {
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: (escape("<strong>") + "News Successfully Deleted") });
                            }
                        });
                    } catch (error) {
                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>News Not Deleted</strong>" });
                    }
                } else if (req.body.postCMS == 'READ_PROPERTY') {
                    try {
                        property.findOne({ _id: req.body._id }, (error, response) => {
                            if (error) {
                                return IMS(res, userData.userName, userData.admin, 1, 1);
                            }
                            else {
                                var propertyHTMLString =
                                    "<h3>" + response.title + "<\/h3>" + '<\/br>' +
                                    '<strong>Is property for rental or sale:</strong>\t\t\t' + (response.isRental ? 'Rental': 'Sale') + '<\/br>' +
                                    '<strong>Is the customer transaction complete:</strong>\t' +  (response.isTransactionComplete  ? 'Completed': 'Incomplete') + '<\/br>' +
                                    '<strong>Square foot:</strong>\t\t\t\t' + response.sqft + '<\/br>' +
                                    '<strong>Is the property commercial or residential:</strong>\t\t' + (response.isCommercial ? 'Commercial': 'residential')+ '<\/br>' +
                                    '<strong>Price:</strong>\t\t\t\t' + response.price + '<\/br>' +
                                    '<strong>Picture reference:</strong>\t\t\t\t' + response.picture + '<\/br>' +
                                    "<img src=\"uploads\/" + response.picture + "\" style=\"max-width:400px;max-height:auto;\" class=\"center\" >" + '<\/br>' +
                                    '<strong>Description:</strong>\t\t' + response.description + '<\/br>' +
                                    '<strong>Location:</strong>\t\t\t\t' + response.location + '<\/br>' +
                                    '<strong>Bedroom count:</strong>\t\t' + response.bedroomCount + '<\/br>' +
                                    '<strong>Bathroom count:</strong>\t\t' + response.bathroomCount + '<\/br>' +
                                    '<strong>Availability date:</strong>\t\t' + response.availabilityDate + '<\/br>' +
                                    '<strong>Lease length:</strong>\t\t\t' + response.leaseLength + '<\/br>' +
                                    '<strong>Title:</strong>\t\t\t\t' + response.title + '<\/br>' +
                                    '<strong>Is live:</strong>\t\t\t\t' +  (response.isLive ? 'Live': 'Not live')+ '<\/br>' +
                                    '<strong>Date added to the system:</strong>\t\t\t' + response.dateEntered + '<\/br>' +
                                    '<strong>Has parking:</strong>\t\t\t' + (response.fc_isParking  ? 'Yes': 'No') + '<\/br>' +
                                    '<strong>Is furnished:</strong>\t\t' + (response.fc_isFurnished  ? 'Yes': 'No')+ '<\/br>' +
                                    '<strong>Has garden:</strong>\t\t\t' + (response.fc_isGarden  ? 'Yes': 'No') + '<\/br>' +
                                    '<strong>Has central Heating:</strong>\t' + (response.fc_isCentralHeating  ? 'Yes': 'No') + '<\/br>' +
                                    '<strong>Has wheelchair access:</strong>\t' + (response.fc_isWheelchairAccess  ? 'Yes': 'No')+ '<\/br>' +
                                    '<strong>Has internet access:</strong>\t' + (response.fc_isInternetAccess  ? 'Yes': 'No')+ '<\/br>' +
                                    '<strong>Has patio?:</strong>\t\t\t' + (response.fc_isPatio  ? 'Yes': 'No')+ '<\/br>' +
                                    '<strong>Property serviced?:</strong>\t' + (response.fc_isServicedProperty  ? 'Yes': 'No')+ '<\/br>';
                                //RETURN SUCCESFUL RESPONSE
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: propertyHTMLString });
                            }
                        });
                    } catch{
                        //TODO ERROR REDIRECT
                    }
                } else if (req.body.postCMS == 'UPDATE_PROPERTY_PAGE') {
                    try {
                        property.findOne({ '_id': req.body._id }, (error, response) => {
                            if (error) {
                                return CMS(res, userData.userName, userData.admin, 0, 0);
                            }
                            else {
                                //VIEW UPDATE PROPERTY PAGE
                                var finalHtmlOutput = updatePropertyPageHTML.replace('_TRANSACTION_', response.isTransactionComplete ? 'checked' : ''); //
                                finalHtmlOutput = finalHtmlOutput.replace('_ID_', response._id);  //
                                finalHtmlOutput = finalHtmlOutput.replace('_PROPERTYTITLE_', response.title);
                                finalHtmlOutput = finalHtmlOutput.replace('_ISRENTAL_', response.isRental ? 'checked' : ''); //
                                finalHtmlOutput = finalHtmlOutput.replace('_SQFT_', response.sqft);
                                finalHtmlOutput = finalHtmlOutput.replace('_ISCOMMERCIAL_', response.isCommercial ? 'Commercial' : 'Residential');
                                finalHtmlOutput = finalHtmlOutput.replace('_PRICE_', response.price); //
                                finalHtmlOutput = finalHtmlOutput.replace('_PICTURES_', response.picture); // "<img src=\"uploads\/"+response.image + "\" style=\"max-width=100px;\" class=\"center\">" + '<\/br>' +
                                finalHtmlOutput = finalHtmlOutput.replace('_IMG_', response.picture /*("<img src=\"uploads\/" + response.picture + "\" style=\"max-width:50px;\" class=\"center\">" + '<\/br>')*/);
                                finalHtmlOutput = finalHtmlOutput.replace('_LOCATION_', response.location);
                                finalHtmlOutput = finalHtmlOutput.replace('_BED_', response.bedroomCount);
                                finalHtmlOutput = finalHtmlOutput.replace('_BATH_', response.bathroomCount);
                                let date = new Date(response.availabilityDate);
                                let dateStr = date.getFullYear().toString() + "-" + ((date.getMonth() + 1) > 9? (date.getMonth() + 1).toString() : ("0" + (date.getMonth() + 1)).toString() ) + "-" + (date.getDate() > 9? date.getDate().toString() : ("0" + date.getDate().toString()));
                                finalHtmlOutput = finalHtmlOutput.replace('_AVAIL_', dateStr); //
                                finalHtmlOutput = finalHtmlOutput.replace('_LEASE_', response.leaseLength); //
                                finalHtmlOutput = finalHtmlOutput.replace('_ISLIVE_', response.isLive ? 'checked' : ''); //
                                finalHtmlOutput = finalHtmlOutput.replace('_PARKING_', response.fc_isParking ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_FURNITURE_', response.fc_isFurnished ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_GARDEN_', response.fc_isGarden ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_HEAT_', response.fc_isCentralHeating ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_WHEELCHAIR_', response.fc_isWheelchairAccess ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_INTERNET_', response.fc_isInternetAccess ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_PATIO_', response.fc_isPatio ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_SERVICED_', response.fc_isServicedProperty ? 'Yes' : 'No');
                                finalHtmlOutput = finalHtmlOutput.replace('_DESCRIPTION_', response.description); //
                                //RETURN SUCCESFUL RESPONSE
                                return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: finalHtmlOutput });
                            }
                        });
                    } catch{
                        //TODO ERROR REDIRECT
                    }

                } else if (req.body.postCMS == 'UPDATE_PROPERTY') {
                    try {
                        property.findOneAndUpdate({ '_id': req.body._id },
                            {
                                $set:
                                {
                                    'isRental': (req.body.isRental == 1 || req.body.isRental == true || req.body.isRental == 'true' || req.body.isRental == 'on') ? true : false,
                                    'isTransactionComplete': (req.body.isTransactionComplete == 1 || req.body.isTransactionComplete == true || req.body.isTransactionComplete == 'true' || req.body.isRental == 'on') ? true : false,
                                    'price': req.body.price,
                                    'description': req.body.description,
                                    'picture': req.body.propertyImageUrl,
                                    'availabilityDate': req.body.availabilityDate,
                                    'leaseLength': req.body.leaseLength,
                                    'isLive': (req.body.isLive == 1 || req.body.isLive == true || req.body.isLive == 'true' || req.body.isLive == 'on') ? true : false,
                                    'dateEntered': new Date()
                                }
                            },
                            {
                                new: true,
                                upsert: true
                            },
                            (err, response) => {
                                if (err) {
                                    return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: (escape("<strong>") + "Update Property Failed</strong>") });
                                } else {
                                    return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: (escape("<strong>") + "Property Successfully Updated</strong>") });
                                }
                            });
                    } catch (error) {
                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Update Property Failed</strong>" });
                    }
                } else if (req.body.postCMS == 'SET_OFFER') {
                    webpost.find({}, function (error, data) {
                        if (error) {
                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set Offer Failed</strong>" });
                        } else {
                            var offerIDs = [];
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].type == "Offer" && data[i]._id != req.body._id) {
                                    offerIDs.push(data[i]._id);
                                }
                            }
                            webpost.findOneAndUpdate({ '_id': req.body._id }, //Set True Offer  req.body._id
                                {
                                    $set:
                                    {
                                        isSet: true
                                    }
                                },
                                {
                                    new: true,
                                    upsert: true
                                },
                                (err, response) => {
                                    if (err) {
                                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set Offer Failed</strong>" });
                                    } else {
                                        //TODO "Set Offer req.body._id  True Success" 
                                    }
                                });
                            for (var i = 0; i < offerIDs.length; i++) //Set the rest false offerIDs
                            {
                                webpost.findOneAndUpdate({ '_id': offerIDs[i]._id },
                                    {
                                        $set:
                                        {
                                            isSet: false
                                        }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    },
                                    (err, response) => {
                                        if (err) {
                                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set Offer Failed</strong>" });
                                        } else {
                                            //TODO "Set Offer req.body._id  False Success" 
                                        }
                                    });
                            }
                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set Offer Successful</strong>" });
                        }
                    });
                } else if (req.body.postCMS == 'SET_NEWS') {
                    webpost.find({}, function (error, data) {
                        if (error) {
                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set News Failed</strong>" });
                        } else {
                            var newsIDs = [];
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].type == "News" && data[i]._id != req.body._id) {
                                    newsIDs.push(data[i]._id);
                                }
                            }
                            webpost.findOneAndUpdate({ '_id': req.body._id },
                                {
                                    $set:
                                    {
                                        isSet: true
                                    }
                                },
                                {
                                    new: true,
                                    upsert: true
                                },
                                (err, response) => {
                                    if (err) {
                                        return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set News Failed</strong>" });
                                    } else {
                                        //TODO "Set News req.body._id  True Success" 
                                    }
                                });
                            for (var i = 0; i < newsIDs.length; i++) //Set the rest false newsIDs
                            {
                                webpost.findOneAndUpdate({ '_id': newsIDs[i]._id },
                                    {
                                        $set:
                                        {
                                            isSet: false
                                        }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    },
                                    (err, response) => {
                                        if (err) {
                                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Post News Failed</strong>" });
                                        } else {
                                            //TODO "Set News req.body._id  False Success" 
                                        }
                                    });
                            }
                            return res.render('cms/cms', { title: 'CMS', user: userData.userName, adminRights: userData.admin, cmsRights: true, cardInnerHTML: "<strong>Set News Successful</strong>" });
                        }
                    });
                }
                else {
                    return res.render('login', { title: 'Login', loginMessage: 'User data not found' });
                }
            }
        }
    });
}

module.exports = {
    accessCMS,
    postCmsScreen
}