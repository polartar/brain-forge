# README

Document for frontend

### What is this repository for?

This repository is for Brainforge frontend project. React(https://reactjs.org/) library and Ant.Design framework (https://ant.design/) are used.

### How do I setup?

Clone this project from git

  ```
  git clone https://github.com/talentdev2020/brain-forge.git
  ```
#### Install dependencies and configure

- Install node packages<br>

  ```
  yarn install or npm install
  ```

#### Set up environment variables

The project expects environment variables to be contained in a file named `.env`.<br>
An example file named `.env.example` is included in the source code containing the fields that need to be populated along with some sample values. It should be sufficient to pass all unit tests.

- Copy the file to `.env` so that the application can use it:

  ```
  cp .env.example .env
  ```

- Populate it with your own variables as needed. **Never include `.env` in the source code! It may contain secrets
  such as API keys.**

#### Start the server

- Run this command

  ```
  yarn start or npm start
  ```

### Frontend

#### Layout

This is the current frontend hierarchy

      frontend/src
      ├── components
      │   ├── ComponentA
      │   │   ├── index.js
      │   │   └── index.test.js
      │   └── ComponentB
      │       ├── index.js
      │       └── index.test.js
      │
      ├── config
      │   └── base.js
      │
      ├── containers
      │   ├── ContainerA
      │   │   ├── index.js
      │   │   └── index.test.js
      │   └── ContainerB
      │       ├── index.js
      │       └── index.test.js
      │
      ├── polyfills
      │   └── localStorage.js
      │
      ├── routes
      │   └── index.js
      │
      ├── store
      │   ├── middlewares
      │   │   ├── tests
      │   │   └── auth.js
      │   │
      │   └── modules
      │       ├── ModuleA
      │       │   ├── tests
      │       │   ├── constants.js
      │       │   ├── index.js
      │       │   ├── reducer.js
      │       │   ├── sagas.js
      │       │   └── selectors.js
      │       └── ModuleB
      │           ├── tests
      │           ├── constants.js
      │           ├── index.js
      │           ├── reducer.js
      │           ├── sagas.js
      │           └── selectors.js
      │
      ├── styles
      │   ├── pageA.scss
      │   └── pageB.scss
      │
      ├── tests
      │   ├── helpers.js
      │   └── mocks.js
      │
      ├── utils
      │   ├── utilsA.js
      │   └── utilsB.js
      │
      ├── index.js
      ├── registerServiceWorker.js
      └── setupTests.js

Pages reside in containers folder and each component has its own test file.

Modules in store folder are core of this project.
It manages redux store and makes AJAX calls using redux-saga and Axios.
Used redux-actions to ease development.

#### How to run tests

Jest and Enzyme testing libraries are used.

- To run the test suits

  ```
  yarn test or npm test
  ```

- To measure test coverage

  ```
  yarn test --coverage or npm test --coverage
  ```
