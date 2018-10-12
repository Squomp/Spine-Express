'use strict';

const financeModel = require('./financeModel');

/**
 * Get current period for user
 * @param {*} req 
 * @param {*} res 
 */
exports.getCurrentPeriod = function (req, res) { 
    financeModel.getCurrentPeriod().then(function (period) {
        return res.json({
            'success': true,
            'data': {
                'peroidData': period
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to retrieve current period"
        });
    })
}


//#region Test calls
/**
 * log a transaction
 * @param {*} req 
 * @param {*} res 
 */
exports.logTest = function (req, res) {
    if (!req.body.amount) {
        return res.status(400).json({
            'success': false,
            'message': 'Valid amount required.'
        });
    }

    financeModel.logTest(req.body.amount).then(function (id) {
        return res.json({
            'success': true,
            'data': {
                'transactionId': id
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to log transaction"
        });
    })
};

/**
 * Get all Tests
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllTests = function (req, res) { 
    financeModel.getAllTests().then(function (tests) {
        return res.json({
            'success': true,
            'data': {
                'tests': tests
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to retrieve all tests."
        });
    })
}
//#endregion