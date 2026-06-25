# Login Test Cases

## TC1 - Valid login
- Given user has valid credentials
- When user logs in
- Then user is redirected to dashboard

## TC2 - Invalid password
- Given user exists
- When user enters wrong password
- Then error message is shown

## TC3 - Empty fields
- When user submits empty form
- Then validation error is shown