'use strict';

const db = require('../mySql');

// JUST A TEST
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