const express = require('express'),
    router = express.Router(),
    authController = require('../auth/authController')
    financeController = require('./financeController');

// TEST CALLS
// router.get('/logs', authController.loginRequired, financeController.getAllTests);
// router.post('/log', authController.loginRequired, financeController.logTest);

router.get('/current', authController.loginRequired, financeController.getCurrentPeriod);

router.get('/past', authController.loginRequired, financeController.getPastPeriods);

router.get('/plan', authController.loginRequired, financeController.getPlan);

router.post('/transactions', authController.loginRequired, financeController.getTransactions);

router.post('/plan', authController.loginRequired, financeController.savePlan);

router.post('/period', authController.loginRequired, financeController.newPeriod);

router.post('/log', authController.loginRequired, financeController.logTransaction);

// Need to export the router variable for use in api.js.
module.exports = router;