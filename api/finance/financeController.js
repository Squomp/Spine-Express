'use strict';

const financeModel = require('./financeModel');

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