# Finance
## [<- Back](../api.md)

# Get Current Period
Requires user performing request to be logged in
#### **Get** `/api/finance/current`

# Get Past Periods
Requires user performing request to be logged in
#### **Get** `/api/finance/past`

# Get Current Plan
Requires user performing request to be logged in
#### **Get** `/api/finance/plan`

# Insert transaction
Requires user performing request to be logged in
#### **POST** `/api/finance/log`
#### BODY
Key | Description | Required
--- | --- | ---
amount | amount of money | *
description | description for  transaction | *
dayOfWeek | dayOfWeek | *
date | date | *
isIncome | true if money in, false if money out | *

# Insert transaction
Requires user performing request to be logged in
#### **POST** `/api/finance/plan`
#### BODY
Key | Description | Required
--- | --- | ---
amount | amount of money | *
period | period for plan | *

# Start new period
Requires user performing request to be logged in
#### **POST** `/api/finance/period`