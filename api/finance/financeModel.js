'use strict';

const db = require('../mySql');

/**
 * Get all test transactions
 */
exports.getCurrentPeriod = function() {
    return new Promise((resolve, reject) => {
        db.query('SELECT u.id, pl.user_id, pl.plan_id, pl.amount, pe.* from Users u, Plans pl, Periods pe where u.id = pl.user_id and pl.plan_id = pe.plan_id and pe.finished is false;', function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}


//#region test methods
/**
 * Log TEST transaction to database
 * @param {string} amount
 */
exports.logTest = function (amount) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO Test SET amount = ?', [amount], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    });
}

/**
 * Get all test transactions
 */
exports.getAllTests = function() {
    return new Promise((resolve, reject) => {
        db.query('Select * From Test', function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}
//#endregion