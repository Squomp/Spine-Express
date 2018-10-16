'use strict';

const db = require('../mySql');

/**
 * Get current period
 */
exports.getCurrentPeriod = function(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT pl.user_id, pl.plan_id, pl.amount, pe.* from Plans pl, Periods pe where pl.user_id = ? and pl.plan_id = pe.plan_id and pe.finished is false;',[userId], function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        })
    })
}

/**
 * Get all past periods
 */
exports.getPastPeriods = function(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT pl.user_id, pl.plan_id, pe.* from Plans pl, Periods pe where pl.user_id = ? and pl.plan_id = pe.plan_id and pe.finished is true order by pe.end_date;',[userId], function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}

/**
 * Get current plan
 */
exports.getCurrentPlan = function(userId) {
    return new Promise((resolve, reject) => {
        db.query('select * from Plans where user_id = ?;',[userId], function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        })
    })
}

/**
 * Save current plan
 */
exports.savePlan = function(userId, amount, period) {
    return new Promise((resolve, reject) => {
        db.query('insert into Plans (user_id, amount, period) values (?, ?, ?);', [userId, amount, period], function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
            }
        })
    })
}

/**
 * Save transaction for weekly plan  
 */
exports.logTransaction = function(periodId, amount, description, dayOfWeek, date, isIncome) {
    return new Promise((resolve, reject) => {
        db.query('insert into Transactions (period_id, amount, description, day_of_week, date, income) values (?, ?, ?, ?, ?, ?);', 
        [periodId, amount, description, dayOfWeek, date, isIncome], function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                if (isIncome) {
                    db.query('update Periods set remaining = remaining + ? where period_id = ?;', 
                    [amount, periodId], function(error, results, fields) {
                            if (error) {
                                reject(error);
                            }
                        }
                    );
                } else {
                    db.query('update Periods set spent = spent + ?, remaining = remaining - ? where period_id = ?;', 
                    [amount, amount, periodId], function(error, results, fields) {
                            if (error) {
                                reject(error);
                            }
                        }   
                    );
                }
                resolve(results.insertId);
            }
        })
    })
}

/**
 * start new period
 */
exports.newPeriod = function(userId) {
    return new Promise((resolve, reject) => {
        db.query('SET @plan_id := (SELECT plan_id from Plans where user_id = ?); SET @plan_amount := (SELECT amount from Plans where user_id = ?); insert into Periods (plan_id, spent, remaining, finished) values (@plan_id, 0.00, @plan_amount, false);', [userId, userId], function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
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