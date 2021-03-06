'use strict';

const db = require('../mySql');

/**
 * Get current period
 */
exports.getCurrentPeriod = function (userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from Periods where user_id = ? and finished is false;', [userId], function (error, results, fields) {
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
        db.query('SELECT * from Periods  where user_id = ? and finished is true order by end_date desc;', [userId], function (error, results, fields) {
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
 * Get transactions
 */
exports.getTransactions = function (periodId) {
    return new Promise((resolve, reject) => {
        db.query('select P.start_date, P.end_date, Transactions.* from Transactions left join Periods P on Transactions.period_id = P.period_id where Transactions.period_id = ? order by Transactions.date desc;', [periodId], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}

/**
 * Save current plan
 */
exports.savePlan = function (userId, amount, period, firstDay) {
    return new Promise((resolve, reject) => {
        db.query('insert into Plans (user_id, amount, period, first_day) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = VALUES(amount), period = VALUES(period), first_day = VALUES(first_day);', [userId, amount, period, firstDay], function (error, results, fields) {
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
        db.query('insert into Transactions (period_id, amount, description, day_of_week, date, income) values ((SELECT period_id from Periods where user_id = ? and finished is false limit 1), ?, ?, ?, ?, ?)',
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
exports.newPeriod = function (userId, startDate, endDate, amount) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE Periods set finished = true where user_id = ? and finished = false;'
            , [userId], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    db.query('insert into Periods (user_id, amount, spent, remaining, start_date, end_date, finished) values (?, ?, 0.00, ?, ?, ?, false);'
                        , [userId, amount, amount, startDate, endDate], function (error, resutls, fields) {
                            if (error) {
                                console.log(error);
                                reject(error);
                            }
                        })
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