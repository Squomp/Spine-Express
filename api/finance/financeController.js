'use strict';

const financeModel = require('./financeModel');

/**
 * Get current period for user
 * @param {*} req 
 * @param {*} res 
 */
exports.getCurrentPeriod = function (req, res) { 
    financeModel.getCurrentPeriod(req.session.user.id).then(function (period) {
        return res.json({
            'success': true,
            'data': {
                'period': period
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to retrieve current period"
        });
    })
}

/**
 * Get past periods for user
 * @param {*} req 
 * @param {*} res 
 */
exports.getPastPeriods = function (req, res) { 
    financeModel.getPastPeriods(req.session.user.id).then(function (periods) {
        return res.json({
            'success': true,
            'data': {
                'periods': periods
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to retrieve past periods"
        });
    })
}

/**
 * Get current plan for user
 * @param {*} req 
 * @param {*} res 
 */
exports.getPlan = function (req, res) { 
    financeModel.getCurrentPlan(req.session.user.id).then(function (plan) {
        return res.json({
            'success': true,
            'data': {
                'plan': plan
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to retrieve current plan"
        });
    })
}

/**
 * Get transactions for current period
 * @param {*} req 
 * @param {*} res 
 */
exports.getTransactions = function (req, res) { 
    if (!req.body.periodId) {
        return res.status(400).json({
            'success': false,
            'message': 'Valid periodId required.'
        });
    }
    financeModel.getTransactions(req.body.periodId).then(function (transactions) {
        return res.json({
            'success': true,
            'data': {
                'transactions': transactions
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to retrieve transactions"
        });
    })
}

/**
 * set plan for user
 * @param {*} req 
 * @param {*} res 
 */
exports.savePlan = function (req, res) { 
    if (!req.body.amount || !req.body.period || !req.body.firstDay) {
        return res.status(400).json({
            'success': false,
            'message': 'Valid amount and period required.'
        });
    }

    financeModel.savePlan(req.session.user.id, req.body.amount, req.body.period, req.body.firstDay).then(function (id) {
        return res.json({
            'success': true,
            'data': {
                'id': id
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to save plan"
        });
    })
}

/**
 * save transaction for user
 * @param {*} req 
 * @param {*} res 
 */
exports.logTransaction = function (req, res) { 
    if (!req.body.amount || !req.body.description || !req.body.dayOfWeek || !req.body.date) {
        return res.status(400).json({
            'success': false,
            'message': 'Valid amount, description, dayOfWeek, date, and isIncome required.'
        });
    }

    financeModel.logTransaction(req.session.user.id, req.body.amount, req.body.description, req.body.dayOfWeek, req.body.date, req.body.isIncome).then(function (id) {
        return res.json({
            'success': true,
            'data': {
                'id': id
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to save transaction"
        });
    })
}

/**
 * start new period for user
 * @param {*} req 
 * @param {*} res 
 */
exports.newPeriod = function (req, res) { 

    if (!req.body.start_date || !req.body.end_date || !req.body.amount) {
        return res.status(400).json({
            'success': false,
            'message': 'Valid start_date and end_date required.'
        });
    }

    financeModel.newPeriod(req.session.user.id, req.body.start_date, req.body.end_date, req.body.amount).then(function (id) {
        return res.json({
            'success': true,
            'data': {
                'periodId': id
            }
        });
    }).catch((error) => {
        return res.status(400).json({
            'success': false,
            'message': "Unable to start new period"
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