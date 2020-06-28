const ctrlLogin = require('../controllers/login');
const ctrlPortal = require('../controllers/portal');
const ctrlIMS = require('../controllers/ims');
const ctrlCMS = require('../controllers/cms');
const ctrlHome = require('../controllers/home');
const ctrlPropertySearch = require('../controllers/search-property');

var express = require('express');
var router = express.Router();

require('multer');
require('ejs');
require('path');
require('formidable');

//LOGIN RENDER FUNCTION
var renderLoginPage = function (req, res, next) {
  res.render('login', { title: 'Login', loginMessage: "" });
}

//ROUTES
router.get('/buy', function (req, res, next) {
  res.render('buy', { title: 'Buy', searchResults: "" });
});

router.get('/rent', function (req, res, next) {
  res.render('rent', { title: 'Rent', searchResults: "" });
});

router.get('/sell', function (req, res, next) {
  res.render('sell', { title: 'Sell' });
});

router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/logout', function (req, res, next) {
  console.log('session ID:' + req.session.userId)
  req.session.destroy(err => { res.clearCookie('sessionID'); res.redirect('/') })
});

router
  .route('/')
  .get(ctrlHome.updateNewsOffers);

router
  .route('/login')
  .get(renderLoginPage)
  .post(ctrlLogin.login);

router
  .route('/cms')
  .get(ctrlCMS.accessCMS)
  .post(ctrlCMS.postCmsScreen);

router
  .route('/ims')
  .get(ctrlIMS.accessIMS)
  .post(ctrlIMS.postImsScreen);

router
  .route('/portal')
  .get(ctrlPortal.accessPortal);

router
  .route('/search-properties')
  .post(ctrlPropertySearch.searchProperties);

router
  .route('/property')
  .get(ctrlPropertySearch.getProperty);

module.exports = router;
