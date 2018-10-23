'use strict';

const db = require('../mySql');

function newPeriod(userId) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE Periods, Plans set Periods.finished = true where Plans.user_id = ? and Periods.plan_id = Plans.plan_id and finished = false;'
                    , [userId], function(error, results, fields) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                db.query('insert into Periods (plan_id, spent, remaining, finished) values ((select plan_id from Plans where user_id = ?), 0.00, (select amount from Plans where user_id = ?), false);'
                , [userId, userId], function(error, resutls, fields) {
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

console.log(newPeriod(4));