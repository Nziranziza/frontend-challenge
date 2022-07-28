# Focus Frontend Engineer Exercise

This is the frontend technical exercise.

Objectives:

-   provide you with an example of the kind of work that you will likely be working on
-   provide a context for our upcoming discussion/interview
-   provide evidence of your coding ability and understanding of relevant stack
-   create an efficient interviewing process based on early alignment on both sides

Technical Stack:

-   Typescript
-   React

Each exercise is written in the form of a typical user story ticket; each part of the exercise is complete after all the acceptance criteria is met.

## Instructions

1. Complete reading through this README page.
2. Initialize a new github repository for your work on these exercises in this this project.
3. Work on the [exercises](./src/pages/instructions.md). These can also be viewed after installing dependencies and running the application.
4. Once you are done with exercises, push all the completed code to your repository and then share the repository with me.

## Timeline

We expect work on the exercises to take 2-4 hours. You may spend as much time as you like on them.

You have 7 days from the day we send you the exercise to submit your forked repo. Since most of our projects need roles filled in quickly, we encourage you to submit as soon as you are able.

## Repository structure

Note: this includes just the relevant files for the exercise

```
README.md
src/
  server/
    db.ts // DB configuration and setup
    index.ts // Server entrypoint
  pages/
    StateSearch.tsx // Implement
    InterstateTradeSearch.tsx // Implement
    StateEconomySearch.tsx // Implement
    Login.tsx // Implement
    Signup.tsx // Implement
    instructions.md
  App.tsx // Main app which includes navigation and the routes that get rendered
  index.tsx // React entry point
  app.db // SQLite DB.  This can get deleted as many times as you would like. App startup will recreate if it does not exist
```

## Styling

These exercsises are not a test of design, so the majority of the effort should be spent on getting the functionality implemented. The repository is making use of [styled-components](https://styled-components.com/) but you are welcome to bring in any UI library you are comfortable with.

## Relevant commands

-   `yarn install` : downloads all the dependencies for the app
-   `yarn start` : starts the frontend React app. Changes will cause a reload
-   `yarn server` : starts the backend API.

## References

-   This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## Notes

-   The goal is to get a sense of how you would do with well scoped tickets for a project. I should conduct a code review with you, verifying that functionality is all there (as well as tests) and providing feedback on the work
-   The exercise is _not_ intended to test a candidate's design chops; however, do note if they they spent time on this and how it does look
-   It's okay if the candidate stores the passwords as plain text. If they do though, I should press on what enhancements could be made to make the implementation more secure

### Follow Up Questions

-   What are some alternative authorization strategies you could use?
-   How would you make the login/signup process more secure?
-   How would you design a table that would store the recent searches a user has performed?
-   What are some techniques that you could use as the database schema evolves with new product requirements?
-   What are some advantages of using graphql vs. a typical REST API?
