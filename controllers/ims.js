var mongoose = require('mongoose');
var user = mongoose.model('user');
var property = mongoose.model('property');
const formidable = require('formidable')

//EJS ESCAPED SNIPPETS
const addUserHTML = "<form action=\'\/ims\' method=\'POST\' enctype=\"multipart/form-data\"><h5>Add User<\/h5><div class=\"form-group\"><label for=\"newUserName\"><strong>User Name<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"newUserName\" name=\"newUserName\" required><\/div><div class=\"form-group\"><label for=\"newFirstName\"><strong>First Name<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"newFirstName\" name=\"newFirstName\" required><\/div><div class=\"form-group\"><label for=\"newSecondName\"><strong>Last Name<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"newSecondName\" name=\"newSecondName\" required><\/div><div class=\"form-group\"><label for=\"newPassword\"><strong>Password<\/strong><\/label><input type=\"password\" class=\"form-control\" id=\"newPassword\" name=\"newPassword\" required><\/div><div class=\"form-group\"><label for=\"newAdminRights\"><strong>Admin Rights<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"newAdminRights\" name=\"newAdminRights\"><\/div><input type=\"hidden\" class=\"form-control\" id=\"postIMS\" name=\"postIMS\" value=\"CREATE_USER\" ><button type=\"submit\" class=\"btn btn-dark\">Submit<\/button><\/form>"
const viewEditUserHTML = "<tr><th scope=\"row\">_NAME_<\/th><td><form action=\'ims\' enctype=\"multipart\/form-data\" method=\'POST\'><input type=\"hidden\" id=\"postIMS\" name=\"postIMS\" value=\"READ_USER\"><input type=\"hidden\" id=\"_id\" name=\"_id\" value=\"_ID_\"><input type=\"hidden\" id=\"viewUserName\" name=\"viewUserName\" value=\"_VIEW_\"><button type=\"submit\" class=\"btn btn-dark\">View<\/button><\/form><\/td><td><form action=\'ims\' enctype=\"multipart\/form-data\" method=\'POST\'><input type=\"hidden\" id=\"postIMS\" name=\"postIMS\" value=\"UPDATE_USER_PAGE\"><input type=\"hidden\" id=\"_id\" name=\"_id\" value=\"_ID_\"><input type=\"hidden\" id=\"editUserName\" name=\"editUserName\" value=\"_EDIT_\"><button type=\"submit\" class=\"btn btn-dark\">Edit<\/button><\/form><\/td><td><form enctype=\"multipart\/form-data\" action=\'ims\' method=\'POST\'><input type=\"hidden\" id=\"postIMS\" name=\"postIMS\" value=\"REMOVE_USER\"><input type=\"hidden\" id=\"removeUserName\" name=\"removeUserName\" value=\"_REMOVE_\"><input type=\"hidden\" id=\"_id\" name=\"_id\" value=\"_ID_\"><button type=\"submit\" class=\"btn btn-danger\">Delete<\/button><\/form><\/td><\/tr>"
const updateUserPageHTML = "<form action=\'\/ims\' method=\'POST\' enctype=\"multipart/form-data\"><h5>Update User Data<\/h5><div class=\"form-group\"><label for=\"newUserName\"><strong>User Name<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"newUserName\" name=\"newUserName\" value=\"_USERNAME_\" required><input type=\"hidden\" id=\"_id\" name=\"_id\" value=\"_ID_\"><\/div><div class=\"form-group\"><label for=\"newFirstName\"><strong>First Name<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"newFirstName\" name=\"newFirstName\" value=\"_FIRSTNAME_\" required><\/div><div class=\"form-group\"><label for=\"newSecondName\"><strong>Last Name<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"newSecondName\" name=\"newSecondName\" value=\"_LASTNAME_\" required><\/div><div class=\"form-group\"><label for=\"newPassword\"><strong>Password<\/strong><\/label><input type=\"password\" class=\"form-control\" id=\"newPassword\" name=\"newPassword\" value=\"_PASSWORD_\" required><\/div><div class=\"form-group\"><label for=\"newAdminRights\"><strong>Admin Rights<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"newAdminRights\" name=\"newAdminRights\" _ADMINRIGHTS_><\/div><input type=\"hidden\" class=\"form-control\" id=\"postIMS\" name=\"postIMS\" value=\"UPDATE_USER\" ><button type=\"submit\" class=\"btn btn-dark\">Submit<\/button><\/form>";
const viewEditPropertyHTML = "<tr><th scope=\"row\">_NAME_<\/th><td><form action=\"ims\" enctype=\"multipart\/form-data\" method=\"POST\"><input name=\"postIMS\" type=\"hidden\" value=\"READ_PROPERTY\" \/> <input name=\"_id\" type=\"hidden\" value=\"_ID_\" \/><button  class=\"btn btn-dark\" type=\"submit\">View<\/button><\/form><\/td><td><form enctype=\"multipart\/form-data\" action=\"ims\" method=\"POST\"><input name=\"postIMS\" type=\"hidden\" value=\"UPDATE_PROPERTY_PAGE\" \/> <input name=\"_id\" type=\"hidden\" value=\"_ID_\" \/> <button  class=\"btn btn-dark\" type=\"submit\">Edit<\/button><\/form><\/td><td><form enctype=\"multipart\/form-data\" action=\"ims\" method=\"POST\"><input name=\"postIMS\" type=\"hidden\" value=\"REMOVE_PROPERTY\" \/> <input name=\"_id\" type=\"hidden\" value=\"_ID_\" \/><button type=\"submit\" class=\"btn btn-danger\">Delete<\/button><\/form><\/td><\/tr>";
const addPropertyHTML = "<form action=\'\/ims\' method=\'POST\' enctype=\"multipart/form-data\"><h5>Add Property<\/h5><div class=\"form-group\"><label for=\"propertyTitle\"><strong>Property title<\/strong><\/label><input required type=\"text\" class=\"form-control\" id=\"propertyTitle\" name=\"propertyTitle\"><\/div><div class=\"form-group\"><label for=\"description\"><strong>Property Description<\/strong><\/label><input required type=\"text\" class=\"form-control\" id=\"description\" name=\"description\"><\/div><div class=\"form-group\"><label for=\"isRental\"><strong>Check if rental, uncheck if sale<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isRental\" name=\"isRental\"><\/div><div class=\"form-group\"><label for=\"isTransactionComplete\"><strong>Is property rented or sold<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isTransactionComplete\" name=\"isTransactionComplete\"><\/div><div class=\"form-group\"><label for=\"sqft\"><strong>sqft<\/strong><\/label><input required  type=\"number\" class=\"form-control\" id=\"sqft\" name=\"sqft\"><\/div><div class=\"form-group\"><label for=\"isCommercial\"><strong>Check if a commercial property<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isCommercial\" name=\"isCommercial\"><\/div><div class=\"form-group\"><label for=\"price\"><strong>Price<\/strong><\/label><input required  type=\"number\" class=\"form-control\" id=\"price\" name=\"price\"><\/div><div class=\"form-group\"><label for=\"pictures\"><strong>Picture<\/strong><\/label><input type=\"file\" required class=\"form-control\" accept=\".jpg,.jpeg,.png\" id=\"pictures\" name=\"pictures\"><\/div><div class=\"form-group\"><label for=\"location\"><strong>Property Location<\/strong><\/label><input required  type=\"text\" class=\"form-control\" id=\"location\" name=\"location\"><\/div><div class=\"form-group\"><label for=\"bedroomCount\"><strong>Bedroom count<\/strong><\/label><input required type=\"number\" class=\"form-control\" id=\"bedroomCount\" name=\"bedroomCount\"><\/div><div class=\"form-group\"><label for=\"bathroomCount\"><strong>Bathroom count<\/strong><\/label><input required  type=\"number\" class=\"form-control\" id=\"bathroomCount\" name=\"bathroomCount\"><\/div><div class=\"form-group\"><label for=\"availabilityDate\"><strong>Availability date<\/strong><\/label><input required type=\"date\" class=\"form-control\" id=\"availabilityDate\" name=\"availabilityDate\"><\/div><div class=\"form-group\"><label for=\"leaseLength\"><strong>Lease Length (0 if sale property) <\/strong><\/label><input required type=\"number\" class=\"form-control\" id=\"leaseLength\" name=\"leaseLength\"><\/div><div class=\"form-group\"><label for=\"isLive\"><strong>Check to set live on creation<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isLive\" name=\"isLive\"><\/div><div class=\"form-group\"><label for=\"fc_isParking\"><strong>Check if property has parking<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isParking\" name=\"fc_isParking\"><\/div><div class=\"form-group\"><label for=\"fc_isFurnished\"><strong>Check if property is furnished<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isFurnished\" name=\"fc_isFurnished\"><\/div><div class=\"form-group\"><label for=\"fc_isGarden\"><strong>Check if property has garden<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isGarden\" name=\"fc_isGarden\"><\/div><div class=\"form-group\"><label for=\"fc_isCentralHeating\"><strong>Check if property has central heating<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isCentralHeating\" name=\"fc_isCentralHeating\"><\/div><div class=\"form-group\"><label for=\"fc_isWheelchairAccess\"><strong>Check if wheelchair accessible<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isWheelchairAccess\" name=\"fc_isWheelchairAccess\"><\/div><div class=\"form-group\"><label for=\"fc_isInternetAccess\"><strong>Check if property has internet<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isInternetAccess\" name=\"fc_isInternetAccess\"><\/div><div class=\"form-group\"><label for=\"fc_isPatio\"><strong>Check if property has patio<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isPatio\" name=\"fc_isPatio\"><\/div><div class=\"form-group\"><label for=\"fc_isServicedProperty\"><strong>Check if serviced property<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isServicedProperty\" name=\"fc_isServicedProperty\"><\/div><input type=\"hidden\" class=\"form-control\" id=\"postIMS\" name=\"postIMS\" value=\"CREATE_PROPERTY\"><button type=\"submit\" class=\"btn btn-dark\">Submit<\/button><\/form>";
const updatePropertyPageHTML = "<form action=\'\/ims\' enctype=\"multipart/form-data\" method=\'POST\'><h5>Edit Property<\/h5><div class=\"form-group\"><label for=\"propertyTitle\"><strong>Property title<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"propertyTitle\"  value=\"_PROPERTYTITLE_\"  name=\"propertyTitle\"><\/div><div class=\"form-group\"><label for=\"description\"><strong>Property Description<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"description\" name=\"description\" value=\"_DESCRIPTION_\"><\/div><div class=\"form-group\"><label for=\"isRental\"><strong>Check if rental, uncheck if sale<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isRental\" _ISRENTAL_  name=\"isRental\"><\/div><div class=\"form-group\"><label for=\"isTransactionComplete\"><strong>Is property rented or sold<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isTransactionComplete\" _TRANSACTION_ name=\"isTransactionComplete\"><\/div><div class=\"form-group\"><label for=\"sqft\"><strong>sqft<\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"sqft\" value=\"_SQFT_\" name=\"sqft\"><\/div><div class=\"form-group\"><label for=\"isCommercial\"><strong>Check if a commercial property<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isCommercial\" _ISCOMMERCIAL_ name=\"isCommercial\"><\/div><div class=\"form-group\"><label for=\"price\"><strong>Price<\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"price\" value=\"_PRICE_\" name=\"price\"><\/div><div class=\"form-group\"><label for=\"pictures\"><strong>Picture<\/strong><\/label>_IMG_<input type=\"file\" required class=\"form-control\" accept=\".jpg,.jpeg,.png\" id=\"pictures\" value=\"_PICTURES_\" name=\"pictures\"><\/div><div class=\"form-group\"><label for=\"location\"><strong>Property Location<\/strong><\/label><input type=\"text\" class=\"form-control\" id=\"location\" value=\"_LOCATION_\" name=\"location\"><\/div><div class=\"form-group\"><label for=\"bedroomCount\"><strong>Bedroom count<\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"bedroomCount\" value=\"_BED_\" name=\"bedroomCount\"><\/div><div class=\"form-group\"><label for=\"bathroomCount\"><strong>Bathroom count<\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"bathroomCount\" value=\"_BATH_\" name=\"bathroomCount\"><\/div><div class=\"form-group\"><label for=\"availabilityDate\"><strong>Availability date<\/strong><\/label><input type=\"date\" class=\"form-control\" id=\"availabilityDate\" value=\"_AVAIL_\" name=\"availabilityDate\"><\/div><div class=\"form-group\"><label for=\"leaseLength\"><strong>Lease Length (0 if sale property) <\/strong><\/label><input type=\"number\" class=\"form-control\" id=\"leaseLength\" value=\"_LEASE_\" name=\"leaseLength\"><\/div><div class=\"form-group\"><label for=\"isLive\"><strong>Check to set live on creation<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"isLive\" _ISLIVE_ name=\"isLive\"><\/div><div class=\"form-group\"><label for=\"fc_isParking\"><strong>Check if property has parking<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isParking\" _PARKING_ name=\"fc_isParking\"><\/div><div class=\"form-group\"><label for=\"fc_isFurnished\"><strong>Check if property is furnished<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isFurnished\" _FURNITURE_ name=\"fc_isFurnished\"><\/div><div class=\"form-group\"><label for=\"fc_isGarden\"><strong>Check if property has garden<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isGarden\" _GARDEN_ name=\"fc_isGarden\"><\/div><div class=\"form-group\"><label for=\"fc_isCentralHeating\"><strong>Check if property has central heating<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isCentralHeating\" _HEAT_ name=\"fc_isCentralHeating\"><\/div><div class=\"form-group\"><label for=\"fc_isWheelchairAccess\"><strong>Check if wheelchair accessible<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isWheelchairAccess\" _WHEELCHAIR_ name=\"fc_isWheelchairAccess\"><\/div><div class=\"form-group\"><label for=\"fc_isInternetAccess\"><strong>Check if property has internet<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isInternetAccess\" _INTERNET_ name=\"fc_isInternetAccess\"><\/div><div class=\"form-group\"><label for=\"fc_isPatio\"><strong>Check if property has patio<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isPatio\" _PATIO_ name=\"fc_isPatio\"><\/div><div class=\"form-group\"><label for=\"fc_isServicedProperty\"><strong>Check if serviced property<\/strong><\/label><input type=\"checkbox\" class=\"form-control\" id=\"fc_isServicedProperty\" _SERVICED_ name=\"fc_isServicedProperty\"><\/div><input type=\"hidden\" class=\"form-control\" id=\"postIMS\" name=\"postIMS\" value=\"UPDATE_PROPERTY\"> <input type=\"hidden\" class=\"form-control\" id=\"_id\" name=\"_id\" value=\"_ID_\">  <button type=\"submit\" class=\"btn btn-dark\">Submit<\/button><\/form>";

const accessIMS = function (req, res) {
    var cookie = req.session.userId;
    var menu = req.query.menu;          // menu - UserManagement=1, RentalProperty=2, SalesProperty=3 
    var subMenu = req.query.subMenu;

    user.findById({ _id: cookie }, function (err, userData) {
        if (err) {
            return res.render('login', {
                title: 'Login',
                loginMessage: 'Error searching for user'
            });
        } else {
            if (userData) {
                // IMS
                if (userData.admin == true) {
                    return IMS(res, userData.userName, userData.admin, menu, subMenu);
                } else {
                    return res.render('login', {
                        title: 'Login',
                        loginMessage: 'Admin Access Required'
                    });
                }
            } else {
                return res.render('login', { title: 'Login', loginMessage: 'User data not found' });
            }
        }
    });
}

function IMS(_res, _user, _adminRights, _menu, _subMenu) {
    var CardHTML = "<h3>Select a menu option<\/h3>";
    var isRender = false;
    if (_menu == 1) { //USER MANAGEMENT
        if (_subMenu == 1) {
            var userSearch = user.find({}, function (error, data) {
                if (error) {
                    //TODO response 
                } else {
                    CardHTML = "<h5>View and Edit Users<\/h5><table class=\"table table-bordered table-light\"><thead><tr><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><\/tr><\/thead><tbody>";
                    for (var i = 0; i < data.length; i++) {
                        var outputHtml = viewEditUserHTML.replace('_EDIT_', data[i].userName);
                        //var name = data[i].userName;
                        outputHtml = outputHtml.replace('_VIEW_', data[i].userName);
                        outputHtml = outputHtml.replace('_NAME_', escape('<strong>') + data[i].userName + escape('</strong>'));
                        outputHtml = outputHtml.replace('_REMOVE_', data[i].userName);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        CardHTML += outputHtml;
                    }
                    CardHTML += escape("</tbody></table>");
                    isRender = true;
                    return _res.render('ims/ims', { title: 'IMS', user: _user, adminRights: _adminRights, cmsRights: true, cardInnerHTML: CardHTML });
                }
            });
        } else
            if (_subMenu == 2) {
                CardHTML = addUserHTML;
                return _res.render('ims/ims', { title: 'IMS', user: _user, adminRights: _adminRights, cmsRights: true, cardInnerHTML: CardHTML });
            } else {

            }
    } else if (_menu == 2) { //PROPERTY MANAGEMENT
        if (_subMenu == 1) {
            var propertySearch = property.find({}, function (error, data) {
                if (error) {
                    //TODO response 
                } else {
                    CardHTML = "<h5>View and Edit Properties<\/h5><table class=\"table table-bordered table-light\"><thead><tr><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><th scope=\"col\"><\/th><\/tr><\/thead><tbody>";
                    for (var i = 0; i < data.length; i++) {
                        var outputHtml = viewEditPropertyHTML.replace('_NAME_', data[i].title);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        outputHtml = outputHtml.replace('_ID_', data[i]._id);
                        CardHTML += outputHtml;
                    }
                    CardHTML += "</tbody></table>";
                    return _res.render('ims/ims', { title: 'IMS', user: _user, adminRights: _adminRights, cmsRights: true, cardInnerHTML: CardHTML });
                }
            });
        } else if (_subMenu == 2) {
            CardHTML = addPropertyHTML;
            return _res.render('ims/ims', { title: 'IMS', user: _user, adminRights: _adminRights, cmsRights: true, cardInnerHTML: CardHTML });
        }
    }
    else {
        return _res.render('ims/ims', { title: 'IMS', user: _user, adminRights: _adminRights, cmsRights: true, cardInnerHTML: CardHTML });
    }

}

const postImsScreen = function (req, res) {
    var fields = {};
    try{
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
            return postIMS(req, res);
        })
    }catch(error)
    {
        console.log(error)
    }
}
const postIMS = function (req, res) {
    var cookie = req.session.userId;
    user.findById({ _id: cookie }, function (err, userData) {
        if (err) {
            return res.render('login', { title: 'Login', loginMessage: 'Error searching for user' });
        } else {
            if (userData) {
                if (userData.admin == true) {
                    if (req.body.postIMS == 'CREATE_USER') {
                        var newUser = {
                            userName: req.body.newUserName,
                            firstName: req.body.newFirstName,
                            secondName: req.body.newSecondName,
                            pwd: req.body.newPassword,
                            admin: (req.body.newAdminRights == 1 || req.body.newAdminRights == 'true' || req.body.newAdminRights == true || req.body.newAdminRights == 'on') ? true : false
                        }
                        try {
                            user.find({}, function (error, data) {
                                if (error) {
                                    //TODO ErrorMSg
                                } else {
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].userName == req.body.newUserName) {
                                            return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: ('<strong>Failed - UserName already exists</strong>') });
                                        }
                                    }
                                    user.findOneAndUpdate({ userName: newUser.userName },
                                        {
                                            firstName: newUser.firstName,
                                            userName: newUser.userName,
                                            secondName: newUser.secondName,
                                            pwd: newUser.pwd,
                                            admin: newUser.admin
                                        },
                                        {
                                            upsert: true,
                                            new: true,
                                            setDefaultsOnInsert: true
                                        },
                                        (err, response) => {
                                            if (err) {
                                                return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: userData.adminRights, cmsRights: true, cardInnerHTML: (escape("<strong>") + newUser.userName + " - Create user Failed</strong>") });
                                            } else {
                                                return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: userData.adminRights, cmsRights: true, cardInnerHTML: (escape("<strong>") + newUser.userName + " Successfully Added</strong>") });
                                            }
                                        });
                                }

                            });

                        } catch (error) {
                            return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: userData.adminRights, cmsRights: true, cardInnerHTML: "<strong>Create user Failed</strong>" });
                        }
                    }
                    else if (req.body.postIMS == 'READ_USER') {
                        try {
                            user.findOne({ _id: req.body._id }, (error, response) => {
                                if (error) {
                                    return IMS(res, userData.userName, userData.admin, 1, 1);
                                }
                                else {
                                    var isChecked = "false";
                                    if (response.admin == 1 || response.admin == true || response.admin == 'true' || response.admin == 'on')
                                        isChecked = 'true';

                                    var viewUsr = "<h5>View User<\/h5><\/br><strong>UserName</strong>:\t" + response.userName + '<\/br>' +
                                        "<strong>FirstName:</strong>\t" + response.firstName + '<\/br>' +
                                        "<strong>SecondName:</strong>\t" + response.secondName + '<\/br>' +
                                        "<strong>Password:</strong>\t" + response.pwd + '<\/br>' +
                                        "<strong>Admin:</strong>\t\t" + isChecked + "\n";

                                    return res.render('ims/ims', {
                                        title: 'IMS',
                                        user: userData.userName,
                                        adminRights: true,
                                        cmsRights: true,
                                        cardInnerHTML: viewUsr
                                    });
                                }
                            });
                        } catch{
                            return IMS(res, userData.userName, userData.admin, 1, 1); //CATCH ERROR REDIRECT
                        }
                    }
                    else if (req.body.postIMS == 'UPDATE_USER_PAGE') {
                        try {
                            user.findOne({ _id: req.body._id }, (error, response) => {
                                if (error) {
                                    return IMS(res, userData.userName, userData.admin, 1, 1);
                                }
                                else {
                                    //VIEW UPDATE USER PAGE
                                    var finalHtmlOutput = updateUserPageHTML.replace('_USERNAME_', response.userName);
                                    finalHtmlOutput = finalHtmlOutput.replace('_FIRSTNAME_', response.firstName);
                                    finalHtmlOutput = finalHtmlOutput.replace('_LASTNAME_', response.secondName);
                                    finalHtmlOutput = finalHtmlOutput.replace('_PASSWORD_', response.pwd);
                                    finalHtmlOutput = finalHtmlOutput.replace('_ID_', response._id);
                                    var isChecked = "";
                                    if (response.admin == 1 || response.admin == true || response.admin == 'true')
                                        isChecked = 'checked'

                                    finalHtmlOutput = finalHtmlOutput.replace('_ADMINRIGHTS_', isChecked);
                                    //RETURN SUCCESFUL RESPONSE
                                    return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: finalHtmlOutput });
                                }
                            });
                        } catch{
                            //TODO ERROR REDIRECT
                        }
                    }
                    else if (req.body.postIMS == 'UPDATE_USER') {
                        var isAdminChecked = false;
                        if (req.body.newAdminRights == 1 || req.body.newAdminRights == true || req.body.newAdminRights == 'true' || req.body.newAdminRights == 'on')
                            isAdminChecked = true;
                        try {
                            user.find({}, function (error, data) {
                                if (!error) {
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].userName == req.body.newUserName && data[i]._id != req.body._id ) {
                                            return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                                            adminRights: true, cmsRights: true, 
                                                                            cardInnerHTML: ('<strong>Failed - UserName already exists</strong>') });
                                        }
                                    }
                                    user.findOneAndUpdate({ '_id': req.body._id },
                                        {
                                            $set:
                                            {
                                                'firstName': req.body.newFirstName,
                                                'userName': req.body.newUserName,
                                                'secondName': req.body.newSecondName,
                                                'pwd': req.body.newPassword,
                                                'admin': isAdminChecked
                                            }
                                        },
                                        {
                                            new: true
                                        },
                                        (err, response) => {
                                            if (err) {
                                                return res.render('ims/ims', {
                                                    title: 'IMS', user: userData.userName,
                                                    adminRights: true, cmsRights: true,
                                                    cardInnerHTML: (escape("<strong>") + req.body.newUserName + " - Update user Failed</strong>")
                                                });
                                            } else {
                                                return res.render('ims/ims', {
                                                    title: 'IMS', user: userData.userName,
                                                    adminRights: true, cmsRights: true,
                                                    cardInnerHTML: (escape("<strong>") + req.body.newUserName + " Successfully Updated</strong>")
                                                });
                                            }
                                        });
                                }
                            });
                        } catch (error) {
                            return res.render('ims/ims', {
                                title: 'IMS', user: userData.userName,
                                adminRights: true, cmsRights: true,
                                cardInnerHTML: "<strong>Update user Failed</strong>"
                            });
                        }
                    }
                    else if (req.body.postIMS == 'REMOVE_USER') {
                        if (req.body.removeUserName == "administrator") {
                            return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                            adminRights: true, cmsRights: true, 
                                                            cardInnerHTML: (escape("<strong>") + req.body.removeUserName + " cannot be deleted</strong>") });
                        }
                        try {
                            user.findOneAndDelete({ _id: req.body._id }, function (error, response) {
                                if (error) {
                                    return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                                    adminRights: true, cmsRights: true, 
                                                                    cardInnerHTML: (escape("<strong>") + req.body.removeUserName + " not deleted</strong>") });
                                } else {
                                    return res.render('ims/ims', {  title: 'IMS', user: userData.userName,  
                                                                    adminRights: true, cmsRights: true, 
                                                                    cardInnerHTML: (escape("<strong>") + req.body.removeUserName + " Successfully Deleted<strong>") });
                                }
                            });
                        } catch (error) {

                            return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                            adminRights: true, cmsRights: true, 
                                                            cardInnerHTML: (escape("<strong>") + req.body.removeUserName + " not deleted</strong>") });
                        }
                    }
                    else if (req.body.postIMS == 'CREATE_PROPERTY') {
                        var isAdminChecked = false;
                        var pic = req.body.pictures;

                        if (req.body.newAdminRights == 1 || req.body.newAdminRights == true || req.body.newAdminRights == 'true' || req.body.newAdminRights == 'on')
                            isAdminChecked = true;
                        try {
                            property.findOneAndUpdate({ title: req.body.propertyTitle }, {
                                //property.create({   
                                'isRental': (req.body.isRental == 1 || req.body.isRental == true || req.body.isRental == 'true' || req.body.isRental == 'on') ? true : false,
                                'isTransactionComplete': (req.body.isTransactionComplete == 1 || req.body.isTransactionComplete == true || req.body.isTransactionComplete == 'true' || req.body.isRental == 'on') ? true : false,
                                'sqft': req.body.sqft,
                                'isCommercial': (req.body.isCommercial == 1 || req.body.isCommercial == true || req.body.isCommercial == 'true' || req.body.isCommercial == 'on') ? true : false,
                                'price': req.body.price,
                                'description': req.body.description,
                                'picture': req.body.propertyImageUrl,
                                'location': req.body.location,
                                'bedroomCount': req.body.bedroomCount,
                                'bathroomCount': req.body.bathroomCount,
                                'availabilityDate': req.body.availabilityDate,
                                'leaseLength': req.body.leaseLength,
                                'title': req.body.propertyTitle,
                                'isLive': (req.body.isLive == 1 || req.body.isLive == true || req.body.isLive == 'true' || req.body.isLive == 'on') ? true : false,
                                'dateEntered': new Date(),
                                'fc_isParking': (req.body.fc_isParking == 1 || req.body.fc_isParking == true || req.body.fc_isParking == 'true' || req.body.fc_isParking == 'on') ? true : false,
                                'fc_isFurnished': (req.body.fc_isFurnished == 1 || req.body.fc_isFurnished == true || req.body.fc_isFurnished == 'true' || req.body.fc_isFurnished == 'on') ? true : false,
                                'fc_isGarden': (req.body.fc_isGarden == 1 || req.body.fc_isGarden == true || req.body.fc_isGarden == 'true' || req.body.fc_isGarden == 'on') ? true : false,
                                'fc_isCentralHeating': (req.body.fc_isCentralHeating == 1 || req.body.fc_isCentralHeating == true || req.body.fc_isCentralHeating == 'true' || req.body.fc_isCentralHeating == 'on') ? true : false,
                                'fc_isWheelchairAccess': (req.body.fc_isWheelchairAccess == 1 || req.body.fc_isWheelchairAccess == true || req.body.fc_isWheelchairAccess == 'true' || req.body.fc_isWheelchairAccess == 'on') ? true : false,
                                'fc_isInternetAccess': (req.body.fc_isInternetAccess == 1 || req.body.fc_isInternetAccess == true || req.body.fc_isInternetAccess == 'true' || req.body.fc_isInternetAccess == 'on') ? true : false,
                                'fc_isPatio': (req.body.fc_isPatio == 1 || req.body.fc_isPatio == true || req.body.fc_isPatio == 'true' || req.body.fc_isPatio == 'on') ? true : false,
                                'fc_isServicedProperty': (req.body.fc_isServicedProperty == 1 || req.body.fc_isServicedProperty == true || req.body.fc_isServicedProperty == 'true' || req.body.fc_isServicedProperty == 'on') ? true : false
                            },
                                {
                                    upsert: true,
                                    new: true,
                                    setDefaultsOnInsert: true
                                },
                                (err, response) => {
                                    if (err) {

                                        return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: ("<strong>Create Property Failed</strong>") });
                                    } else {

                                        return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: (escape("<strong>") + req.body.propertyTitle + " Property Successfully Added</strong>") });
                                    }
                                });
                        } catch (error) {
                            return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights:true, cmsRights: true, cardInnerHTML: ("<strong>Create Property Failed</strong>") });
                        }
                    }
                    else if (req.body.postIMS == 'READ_PROPERTY') {

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
                                        "<img src=\"uploads\/" + response.picture + "\" style=\"max-width:400px;max-height:auto;\" class=\"center\" >"  + '<\/br>' + 
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
                                    return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                                    adminRights: true, cmsRights: true, 
                                                                    cardInnerHTML: propertyHTMLString });
                                }
                            });
                        } catch{
                            //TODO ERROR REDIRECT
                        }
                    }
                    else if (req.body.postIMS == 'UPDATE_PROPERTY_PAGE') {

                        try {

                            property.findOne({ '_id': req.body._id }, (error, response) => {
                                if (error) {
                                    return IMS(res, userData.userName, userData.admin, 1, 1);
                                }
                                else {
                                    //VIEW UPDATE PROPERTY PAGE
                                    var finalHtmlOutput = escape("<strong>") + updatePropertyPageHTML.replace('_TRANSACTION_', response.isTransactionComplete ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_ID_', response._id);
                                    finalHtmlOutput = finalHtmlOutput.replace('_PROPERTYTITLE_', response.title);
                                    finalHtmlOutput = finalHtmlOutput.replace('_ISRENTAL_', response.isRental ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_SQFT_', response.sqft);
                                    finalHtmlOutput = finalHtmlOutput.replace('_ISCOMMERCIAL_', response.isCommercial ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_PRICE_', response.price);
                                    finalHtmlOutput = finalHtmlOutput.replace('_PICTURES_', response.picture);
                                    finalHtmlOutput = finalHtmlOutput.replace('_IMG_', response.picture/*("<img src=\"uploads\/" + response.picture + "\" style=\"max-width:50px;\" class=\"center\">" + '<\/br>')*/);
                                    finalHtmlOutput = finalHtmlOutput.replace('_LOCATION_', response.location);
                                    finalHtmlOutput = finalHtmlOutput.replace('_BED_', response.bedroomCount);
                                    finalHtmlOutput = finalHtmlOutput.replace('_BATH_', response.bathroomCount);
                                    let date = new Date(response.availabilityDate);
                                    let dateStr = date.getFullYear().toString() + "-" + ((date.getMonth() + 1) > 9? (date.getMonth() + 1).toString() : ("0" + (date.getMonth() + 1)).toString() ) + "-" + (date.getDate() > 9? date.getDate().toString() : ("0" + date.getDate().toString()));
                                    finalHtmlOutput = finalHtmlOutput.replace('_AVAIL_', dateStr);
                                    finalHtmlOutput = finalHtmlOutput.replace('_LEASE_', response.leaseLength);
                                    finalHtmlOutput = finalHtmlOutput.replace('_ISLIVE_', response.isLive ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_PARKING_', response.fc_isParking ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_FURNITURE_', response.fc_isFurnished ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_GARDEN_', response.fc_isGarden ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_HEAT_', response.fc_isCentralHeating ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_WHEELCHAIR_', response.fc_isWheelchairAccess ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_INTERNET_', response.fc_isInternetAccess ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_PATIO_', response.fc_isPatio ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_SERVICED_', response.fc_isServicedProperty ? 'checked' : '');
                                    finalHtmlOutput = finalHtmlOutput.replace('_DESCRIPTION_', response.description);
                                    finalHtmlOutput += escape("</strong>");
                                    //RETURN SUCCESFUL RESPONSE
                                    return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: finalHtmlOutput });
                                }
                            });
                        } catch{
                            //TODO ERROR REDIRECT
                        }


                    }
                    else if (req.body.postIMS == 'UPDATE_PROPERTY') {

                        try {
                            property.findOneAndUpdate({ '_id': req.body._id },
                                {
                                    $set:
                                    {
                                        'isRental': (req.body.isRental == 1 || req.body.isRental == true || req.body.isRental == 'true' || req.body.isRental == 'on') ? true : false,
                                        'isTransactionComplete': (req.body.isTransactionComplete == 1 || req.body.isTransactionComplete == true || req.body.isTransactionComplete == 'true' || req.body.isRental == 'on') ? true : false,
                                        'sqft': req.body.sqft,
                                        'isCommercial': (req.body.isCommercial == 1 || req.body.isCommercial == true || req.body.isCommercial == 'true' || req.body.isCommercial == 'on') ? true : false,
                                        'price': req.body.price,
                                        'description': req.body.description,
                                        'location': req.body.location,
                                        'picture': req.body.propertyImageUrl,
                                        'bedroomCount': req.body.bedroomCount,
                                        'bathroomCount': req.body.bathroomCount,
                                        'availabilityDate': req.body.availabilityDate,
                                        'leaseLength': req.body.leaseLength,
                                        'title': req.body.propertyTitle,
                                        'isLive': (req.body.isLive == 1 || req.body.isLive == true || req.body.isLive == 'true' || req.body.isLive == 'on') ? true : false,
                                        'dateEntered': new Date(),
                                        'fc_isParking': (req.body.fc_isParking == 1 || req.body.fc_isParking == true || req.body.fc_isParking == 'true' || req.body.fc_isParking == 'on') ? true : false,
                                        'fc_isFurnished': (req.body.fc_isFurnished == 1 || req.body.fc_isFurnished == true || req.body.fc_isFurnished == 'true' || req.body.fc_isFurnished == 'on') ? true : false,
                                        'fc_isGarden': (req.body.fc_isGarden == 1 || req.body.fc_isGarden == true || req.body.fc_isGarden == 'true' || req.body.fc_isGarden == 'on') ? true : false,
                                        'fc_isCentralHeating': (req.body.fc_isCentralHeating == 1 || req.body.fc_isCentralHeating == true || req.body.fc_isCentralHeating == 'true' || req.body.fc_isCentralHeating == 'on') ? true : false,
                                        'fc_isWheelchairAccess': (req.body.fc_isWheelchairAccess == 1 || req.body.fc_isWheelchairAccess == true || req.body.fc_isWheelchairAccess == 'true' || req.body.fc_isWheelchairAccess == 'on') ? true : false,
                                        'fc_isInternetAccess': (req.body.fc_isInternetAccess == 1 || req.body.fc_isInternetAccess == true || req.body.fc_isInternetAccess == 'true' || req.body.fc_isInternetAccess == 'on') ? true : false,
                                        'fc_isPatio': (req.body.fc_isPatio == 1 || req.body.fc_isPatio == true || req.body.fc_isPatio == 'true' || req.body.fc_isPatio == 'on') ? true : false,
                                        'fc_isServicedProperty': (req.body.fc_isServicedProperty == 1 || req.body.fc_isServicedProperty == true || req.body.fc_isServicedProperty == 'true' || req.body.fc_isServicedProperty == 'on') ? true : false
                                    }
                                },
                                {
                                    new: true,
                                    upsert: true
                                },
                                (err, response) => {
                                    if (err) {

                                        return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: (escape("<strong>") + "Update Property Failed</strong>") });
                                    } else {
                                        return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: (escape("<strong>") + "Property Successfully Updated</strong>") });

                                    }
                                });
                        } catch (error) {
                            return res.render('ims/ims', { title: 'IMS', user: userData.userName, adminRights: true, cmsRights: true, cardInnerHTML: "<strong>Update Property Failed</strong>" });
                        }
                    }
                    else if (req.body.postIMS == 'REMOVE_PROPERTY') {
                        try {
                            property.findOneAndDelete({ '_id': req.body._id }, function (error, response) {
                                if (error) {
                                    return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                                    adminRights: true, cmsRights: true, 
                                                                    cardInnerHTML: (escape("<strong>") + "Property Not Deleted</strong>") });
                                } else {
                                    return res.render('ims/ims', { title: 'IMS', user: userData.userName, 
                                                                    adminRights: true, cmsRights: true, 
                                                                    cardInnerHTML: (escape("<strong>") + "Property Successfully Deleted</strong>") });
                                }
                            });
                        } catch (error) {

                            return res.render('ims/ims', {  title: 'IMS', user: userData.userName, 
                                                            adminRights: true, cmsRights: true, 
                                                            cardInnerHTML: ("<strong>Property Not Deleted</strong>") });
                        }
                    } else {
                        return res.render('login', { title: 'Login', loginMessage: 'Admin Access Required' });
                    }
                } else {
                    return res.render('login', { title: 'Login', loginMessage: 'User data not found' });
                }
            }
        }
    });
}

module.exports = {
    //postIMS,
    postImsScreen,
    accessIMS
}