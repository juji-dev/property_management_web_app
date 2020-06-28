var mongoose = require('mongoose');
var user = mongoose.model('user');

const login = function (req, res) {
    var inUserName = req.body.userName;
    var inPwd = req.body.pwd;
    // > FIND USER
    user.findOne({ userName: inUserName, pwd: inPwd }, function (err, userData) {
        if (err) {
            res.render('login', { title: 'Login', loginMessage: 'Incorrect credentials, try again..' });
        } else {
            if (userData) {
                // > ASSIGN SESSION COOKIE
                if (userData.pwd == inPwd && userData.userName == inUserName) {
                    req.session.userId = userData._id;
                    // > RENDER PORTAL
                    return res.render('portal', { title: 'Portal', user: userData.userName, adminRights: userData.admin, cmsRights: true });
                }
                else
                    return res.render('login', { title: 'Login', loginMessage: 'Incorrect credentials, try again..' });
            } else {
                res.render('login', { title: 'Login', loginMessage: 'Incorrect credentials, try again..' });
            }
        }
    })
};

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports = {
    login
}