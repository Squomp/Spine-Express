'use strict';

const db = require('../mySql');

/**
 * Get current period
 */
exports.getCurrentPeriod = function (userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT pl.user_id, pl.plan_id, pl.amount, pe.* from Plans pl, Periods pe where pl.user_id = ? and pl.plan_id = pe.plan_id and pe.finished is false;', [userId], function (error, results, fields) {
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
exports.getPastPeriods = function (userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT pl.user_id, pl.plan_id, pe.* from Plans pl, Periods pe where pl.user_id = ? and pl.plan_id = pe.plan_id and pe.finished is true order by pe.end_date;', [userId], function (error, results, fields) {
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
exports.getCurrentPlan = function (userId) {
    return new Promise((resolve, reject) => {
        db.query('select * from Plans where user_id = ?;', [userId], function (error, results, fields) {
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
exports.savePlan = function (userId, amount, period) {
    return new Promise((resolve, reject) => {
        db.query('insert into Plans (user_id, amount, period) values (?, ?, ?) ON DUPLICATE KEY UPDATE amount     = VALUES(amount), period = VALUES(period);', [userId, amount, period], function (error, results, fields) {
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
exports.logTransaction = function (userId, amount, description, dayOfWeek, date, isIncome) {
    return new Promise((resolve, reject) => {
        const income = isIncome === 'true' ? 1 : 0;
        db.query('insert into Transactions (period_id, amount, description, day_of_week, date, income) values ((SELECT pe.period_id from Plans pl, Periods pe where pl.user_id = ? and pl.plan_id = pe.plan_id and pe.finished is false limit 1), ?, ?, ?, ?, ?)',
            [userId, amount, description, dayOfWeek, date, income], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    db.query('select period_id from Transactions where transaction_id = ?', [results.insertId],
                        function (error, results, fields) {
                            if (error) {
                                reject(error);
                            } else {
                                if (income) {
                                    db.query('update Periods set remaining = remaining + ? where period_id = ?;',
                                        [amount, results[0].period_id], function (error, results, fields) {
                                            if (error) {
                                                console.log(error);
                                                reject(error);
                                            }
                                        }
                                    );
                                } else {
                                    db.query('update Periods set spent = spent + ?, remaining = remaining - ? where period_id = ?;',
                                        [amount, amount, results[0].period_id], function (error, results, fields) {
                                            if (error) {
                                                console.log(error);
                                                reject(error);
                                            }
                                        }
                                    );
                                }
                            }
                        })
                    resolve(results.insertId);
                }
            })
    })
}

/**
 * start new period
 */
exports.newPeriod = function (userId) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE Periods, Plans set Periods.finished = true where Plans.user_id = ? and Periods.plan_id = Plans.plan_id and finished = false;'
            , [userId], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    db.query('insert into Periods (plan_id, spent, remaining, finished) values ((select plan_id from Plans where user_id = ?), 0.00, (select amount from Plans where user_id = ?), false);'
                        , [userId, userId], function (error, resutls, fields) {
                            if (error) {
                                console.log(error);
                                reject(error);
                            }
                        })
                    console.log(results);
                    resolve(results.insertId);
                }
            });
    });
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
exports.getAllTests = function () {
    return new Promise((resolve, reject) => {
        db.query('Select * From Test', function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}
//#endregion