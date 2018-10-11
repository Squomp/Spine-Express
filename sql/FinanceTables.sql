CREATE TABLE Plans
(
    plan_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(13, 2) NOT NULL,
    period varchar(10),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, user_id)
);
CREATE UNIQUE INDEX plans_uindex ON Plans (plan_id, user_id);


CREATE TABLE Periods
(
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    spent DECIMAL(13, 2) NOT NULL,
    remaining DECIMAL(13, 2) NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES Plans(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, user_id)
);
CREATE UNIQUE INDEX period_uindex ON Periods (plan_id, user_id);

CREATE TABLE Transactions
(
    transaction_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    spent DECIMAL(13, 2) NOT NULL,
    remaining DECIMAL(13, 2) NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES Periods(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES Periods(plan_id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id)
);
CREATE UNIQUE INDEX transaction_uindex ON Transactions(plan_id, user_id);

SHOW TABLES;

SELECT * from Transactions;
SELECT * from Periods;
SELECT * from Plans;

