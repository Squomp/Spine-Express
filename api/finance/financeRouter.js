const express = require('express'),
    router = express.Router(),
    authController = require('../auth/authController')
    financeController = require('./financeController');

// router.get('/current', authController.loginRequired, financeController.getCurrentPeriod);

// router.get('/past', authController.loginRequired, financeController.getPastPeriods);

// router.post('/log', authController.loginRequired, financeController.logTransaction);

//TEST CALLS
router.get('/logs', authController.loginRequired, financeController.getAllTests);
router.post('/log', authController.loginRequired, financeController.logTest);

// router.post('/plan', authController.loginRequired, financeController.setPlan);

// router.get('/plan', authController.loginRequired, financeController.getPlan);

// Need to export the router variable for use in api.js.
module.exports = router;