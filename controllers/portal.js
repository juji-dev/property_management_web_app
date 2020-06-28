
var mongoose = require('mongoose');
var user = mongoose.model('user');

const accessPortal = function (req, res) {
    var cookie = req.session.userId;
    user.findById({ _id: cookie }, function (err, userData) {
        if (err) {
            res.render('login', { 'title': 'Login', 'loginMessage': 'Error searching for user' });
        } else {
            if (userData) {
                return res.render('portal', { 'title': 'Portal', 'user': userData.userName, 'adminRights': userData.admin, 'cmsRights': true });
            } else {
                return res.render('login', { 'title': 'Login', 'loginMessage': 'Unauthorized Access Denied' });
            }
        }
    });
}

module.exports = {
    accessPortal
}