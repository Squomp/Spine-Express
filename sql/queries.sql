
select * from Users;
select * from Periods;
select * from Plans;
select * from Transactions;


# get current period
SELECT pl.user_id, pl.plan_id, pe.*
  from Plans pl, Periods pe
  where pl.user_id = ?
    and pl.plan_id = pe.plan_id
    and pe.finished is false;

# get past periods
SELECT pl.user_id, pl.plan_id, pe.*
  from Plans pl, Periods pe
  where pl.user_id = ?
    and pl.plan_id = pe.plan_id
    and pe.finished is true
  order by pe.end_date;


# get current plan
select *
  from Plans
  where user_id = ?;

# save plan
insert into Plans (user_id, amount, period)
  values (?, ?, ?)
ON DUPLICATE KEY UPDATE
  amount     = VALUES(amount),
  period = VALUES(period);

# save transaction
insert into Transactions (period_id, amount, description, day_of_week, date, income)
  values ((SELECT pe.period_id
      from Plans pl, Periods pe
      where pl.user_id = ?
        and pl.plan_id = pe.plan_id
        and pe.finished is false), ?, ?, ?, ?, ?);

# update period spent and remaining after transaction saved for SPENT
update Periods
  set spent = spent + ?,
      remaining = remaining - ?
  where period_id = ?;

# update period spent and remaining after transaction saved for RECEIVED
update Periods
  set remaining = remaining + ?
  where period_id = ?;

# new period
start transaction;
UPDATE Periods, Plans
set Periods.finished = true
where Plans.user_id = ?
  and Periods.plan_id = Plans.plan_id
  and finished = false;
insert into Periods (plan_id, spent, remaining, finished)
  values ((select plan_id
            from Plans
            where user_id = ?),
          0.00,
          (select amount
            from Plans
            where user_id = ?),
          false);
rollback;


delete from Transactions where period_id=9;

update Periods set remaining = 70 where period_id=9;
delete from Periods where period_id < 10;


select P.start_date, P.end_date, Transactions.* from Transactions
  left join Periods P on Transactions.period_id = P.period_id
  where Transactions.period_id = ?;