var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/auth');
var customersCtrl = require('../controllers/customers');
var subsCtrl = require('../controllers/subscriptions');
var branchesCtrl = require('../controllers/branches');
var subsCtrl = require('../controllers/subscriptions');
var plansCtrl = require('../controllers/plans');
var checkoutCtrl = require('../controllers/checkout');
var validateRequest = require('../middlewares/validateRequest');
var debug = require('debug')('billing');

module.exports = router;

/*** Authorization Routes ***/
router.post('/authorize', authCtrl.authorizeBranch);

/*** Validation Middleware. Don't move it!!! ***/
router.use(validateRequest);

/****************************************
*			Authorized zone				*
*****************************************/

router.use(function (req, res, next){
	req.body.customerId = req.decoded._id;
	req.body.branchId = req.decoded.branchId;
	next();
});

router.post('/getProfile', customersCtrl.get);
router.post('/addCard', customersCtrl.addCard);
router.post('/updateCard', customersCtrl.updateCard);

router.post('/getSubscription', subsCtrl.get);
router.post('/changePassword', branchesCtrl.changePassword);

router.post('/getPlans', plansCtrl.getPlans);

router.post('/changePlan', subsCtrl.changePlan);

router.post('/checkout', checkoutCtrl.checkout);

