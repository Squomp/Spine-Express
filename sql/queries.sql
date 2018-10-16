
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
  values (?, ?, ?);

# save transaction
insert into Transactions (period_id, amount, description, day_of_week, date, income)
  values (?, ?, ?, ?, ?, ?);

# update period spent and remaining after transaction saved for SPENT
update Periods
  set 'spent' = spent + ?,
      'remaining' = remaining - ?
  where period_id = ?;

# update period spent and remaining after transaction saved for RECIEVED
update Periods
  set 'remaining' = remaining + ?
  where period_id = ?;

# new period
SET @plan_id := (SELECT plan_id from Plans where user_id = ?);
SET @plan_amount := (SELECT amount from Plans where user_id = ?);
insert into Periods (plan_id, spent, remaining, finished) values (@plan_id, 0.00, @plan_amount, false);

