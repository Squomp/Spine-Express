
select * from Users;
select * from Periods;
select * from Transactions;
select * from Plans;

delete from Users where username = 'Demo';

update Periods set start_date = '2018-11-25', end_date = '2018-12-01' where period_id = 11;

delete from Transactions where transaction_id = 20;

insert into Periods (user_id, amount, spent, remaining, start_date, end_date, finished)
  VALUES (11, 50, 40, 10, '2018-11-25', '2018-12-01', 1);

insert into Transactions (period_id, amount, description, day_of_week, date, income)
  values (16, 10, 'dinner', 'monday', '2018-11-28', 0);

Alter table Periods
    add column amount DECIMAL(13, 2) not null;

alter table Periods
    drop foreign key Periods_ibfk_1;

alter table Periods
    drop column plan_id;

update Periods set finished=0 where period_id = 16;

insert into Periods (user_id, amount, spent, remaining, start_date, end_date, finished)
  values (4, 100, 0, 100, '2018-11-13', '2018-11-20', 0);

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
UPDATE Periods, Plans
  set Periods.finished = true
  where Plans.user_id = ?
    and Periods.plan_id = Plans.plan_id
    and finished = false;
insert into Periods (plan_id, spent, remaining, start_date, end_date, finished)
  values ((select plan_id from Plans where user_id = ?),
          0.00,
          (select amount from Plans where user_id = ?),
          ?,
          ?,
          false);


delete from Transactions where period_id=9;

update Periods set remaining = 70 where period_id=9;
delete from Periods where period_id < 10;

update Periods set finished = true where period_id = 2;

select P.start_date, P.end_date, Transactions.* from Transactions
  left join Periods P on Transactions.period_id = P.period_id
  where Transactions.period_id = ?;