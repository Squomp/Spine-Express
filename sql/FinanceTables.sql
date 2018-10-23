CREATE TABLE Plans
(
    plan_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(13, 2) NOT NULL,
    period varchar(10),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id)
);
CREATE UNIQUE INDEX plans_uindex ON Plans (user_id);

CREATE TABLE Periods
(
    period_id int not null auto_increment,
    plan_id INT NOT NULL,
    spent DECIMAL(13, 2) NOT NULL,
    remaining DECIMAL(13, 2) NOT NULL,
    start_date DATE,
    end_date DATE,
    finished boolean not null,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE,
    PRIMARY KEY (period_id)
);
CREATE UNIQUE INDEX period_uindex ON Periods (period_id, plan_id);

CREATE TABLE Transactions
(
    transaction_id INT NOT NULL AUTO_INCREMENT,
    period_id INT NOT NULL,
    amount DECIMAL(13, 2) NOT NULL,
    description varchar(50),
    day_of_week varchar(10),
    date varchar(100),
    income boolean not null,
    FOREIGN KEY (period_id) REFERENCES Periods(period_id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id)
);

SHOW TABLES;

# SELECT * from Transactions;
# SELECT * from Periods;
# SELECT * from Plans;

# SET FOREIGN_KEY_CHECKS=0;
# drop table Plans;
# drop table Periods;
drop table Transactions;
# SET FOREIGN_KEY_CHECKS=1;