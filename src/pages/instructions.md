# Exercises

The data is all publicly available at https://datausa.io/, which is powered by a public API that can be accessed without an API key. The goal of these exercises is to write implementations that match the acceptance criteria.

Recommended approach:

-   For each exercise, create a pull request (PR) and merge your PR into main for your repository

## Setup

-   `yarn install` : downloads all the dependencies for the app
-   `yarn start` : starts the frontend React app. Changes will cause a reload
-   `yarn server` : starts the backend API.

**Note: changes are not required to the server, but you will need it running as the the exercises ask you to fetch data from it.**

## 1. Create a login flow and restrict access to the existing pages when a user is not logged in

### Acceptance Criteria

-   As a user, I should be able to sign up for an account and access the other pages
    -   To sign up, I need to enter a username and password; implemented at http://localhost:3000/signup
    -   The sign up form should ask the user to confirm the password
-   As as a user, I should be able to login and be shown an error message if the username or password are wrong
-   As a user, I should only be able to access the home, login and signup routes (`/`, `/login`, `/signup`) if not logged in; if the user accesses any other route they should be directed to `/login`
-   As a user, if I am logged in I should be redirected to `/` if I navigate to `/login` or `/signup`

#### Implementation Notes

-   The endpoint for signing up and logging already exists
    -   Both login and signup expects a POST body of shape `{username: <USERNAME>, password: <PASSWORD>}`
-   An endpoint exists at `localhost:4000/session` for checking if the the user is authenticated

### Rough Example UI

![Exercise 1 Signup](images/exercise-1-signup.png)
![Exercise 1 Login](images/exercise-1-login.png)

## 2. Create a UI for visualizing the states available

### Acceptance Criteria

-   As a user, I should be able to search for a state
-   As a user, I should be able to the name of the id, key, name, slug and a link that opens the population API

### Implementation Notes

-   The data to display is available in the graphql server and can be fetched like so:

```ts
const data = await client.query({
    query: gql`
        query Query {
            states(name: null) {
                id
                key
                slug
                name
            }
        }
    `,
})
```

-   The link to the population API will look like https://datausa.io/api/data?Geography=Geography-State-04000US06&Nativity=2&measure=Total%20Population,Total%20Population%20MOE%20Appx&drilldowns=Birthplace&properties=Country%20Code

### Example UI

![Exercise 2](images/exercise-2.png)

## 3. Create a UI for visualizing interstate trade for a state

### Acceptance Criteria

-   As a user, I should be able to search for a state
-   This should be implemented at http://localhost:3000/trade
-   As a user, I should be able to see (per state):
    -   The total $ amount for all interstate trade for the state
    -   The total tons for all interstate trade for for the state
    -   The top five states in terms of $ amounts
    -   The top five states in terms of tons
-   There are tests covering this functionality

### Implementation Notes

-   Implement your solution in InterstateTrade.tsx
-   [This](https://datausa.io/api/data?Origin%20State=04000US51&measure=Millions%20Of%20Dollars,Thousands%20Of%20Tons&drilldowns=Destination%20State&year=latest) is an example URL (for Virginia/04000US51) that returns the data.
-   The data can be fetched directly from the datause.io API in the browser

### Example UI

![Exercise 3](images/exercise-3.png)

## 4. Create a UI for visualizing a state's economy

### Acceptance Criteria

-   As a user, I would like to be select the data I would like to see (per state):
    -   Interstate trade (identical view to the one created in Exercise 1)
    -   Employment Industries
        -   The top industry in terms of number of people working in it
        -   The top industry in terms of average salary
    -   Domestic Production
        -   The top five produced goods per state in terms of dollars
        -   The top five produced goods per state in terms of tons
    -   This should be implemented at http://localhost:3000/economy

### Implementation Notes

-   The data for this UI is available in the graphql server, this is an example query (that fetches all data sources)

```ts
const data = await client.query<{
    states: StateEconomyResult[]
}>({
    query: gql`
        query Query {
            states(name: null) {
                name
                productionSummary {
                    productionTypeByDollars {
                        name
                        amount
                    }
                    productionTypeByTons {
                        amount
                        name
                    }
                }
                employmentSummary {
                    topIndustryByAverageSalary {
                        averageSalary
                        industry
                    }
                    topIndustryByEmployee {
                        employedCount
                        industry
                    }
                }
                tradeSummary {
                    totalDollarAmount
                    totalTons
                    statesByDollars {
                        amount
                        name
                    }
                    statesByTons {
                        amount
                        name
                    }
                }
            }
        }
    `,
})
```

-   If you do not want to include a particular set of data (i.e. the user has filtered it), simply do not include it from the query. For example, if I did not want to fetch the trade summary, I would remove

```ts
tradeSummary {
    totalDollarAmount
    totalTons
    statesByDollars {
        amount
        name
    }
    statesByTons {
        amount
        name
    }
}
```

### Example UI

![Exercise 4](images/exercise-4.png)

## Troubleshooting

-   If you encounter an issue fetching a data from the API, it is possible that you've hit the rate limiting implemented by datausa.io. To resolve it, simply visit https://datausa.io/api/data?Origin%20State=04000US51&measure=Millions%20Of%20Dollars,Thousands%20Of%20Tons&drilldowns=Destination%20State&year=latest directly and complete the captcha.
-   If you encounter an issue with `yarn install` while installing sqlite3 (likely only if you have an M1 machine), it is likely caused by using the wrong version of python. To fix it run, `yarn install -python=/usr/bin/python2`
