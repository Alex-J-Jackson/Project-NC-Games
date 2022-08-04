# Backend Project: NC Games

## Link to the hosted version

https://be-project-nc-games.herokuapp.com/api

## Summary

This is an API built in JavaScript. It includes GET, POST, PATCH and DELETE functionality and uses boardgame themed data.

## Instructions to clone, install dependencies, seed local database and run tests

Fork and clone the repository then npm install the following: `dotenv`, `express`, `pg`, `pg-format`, `jest`, `jest-extended` and `supertest`.

To set up the database run `npm run setup-dbs`. To seed the development-data run `npm run seed`. The test-data will seed and the tests will run when you run `npm test index.test.js`.

## .env set-up

To connect to the databases locally a `.env.test` file and a `.env.development` file must be added to the directory. Into each of these files add the following: `PGDATABASE=<database_name_here>`. The database names can be found in `/db/setup.sql`.

## Minimum versions of Node and Postgres to run the project

Node 6.0.0 and
