
select * from Periods;
select * from Plans;

SELECT u.id, pl.user_id, pl.plan_id, pl.amount, pe.*
  from Users u, Plans pl, Periods pe
  where u.id = pl.user_id
    and pl.plan_id = pe.plan_id
    and pe.finished is false;


