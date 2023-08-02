<p align="center">
   <a href="https://github.com/eclipse-xpanse/xpanse-ui/actions/?query=workflow%3Axpanse-ui+branch%3Amain">
      <img alt="Github Actions Build Status" src="https://github.com/eclipse-xpanse/xpanse-ui/actions/workflows/xpanse.yml/badge.svg" />
   </a>
   <a href="#badge">
      <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" />
   </a>
   <a href="https://opensource.org/licenses/Apache-2.0" target="_blank">
      <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="coverage" />
   </a>
</p>

# Xpanse UI

This is the frontend for the Xpanse project which allows cloud service providers to register managed services to the
service catalog and also for end users to deploy services from the service catalog and manage them.

## Development Setup

Documentation can be found on the project website [here](https://eclipse-xpanse.github.io/xpanse-website/docs/ui)

### Unit Tests

We use `jest` framework for unit testing React components.

To add unit tests, add a folder called `__tests__` folder closet to the component under test. This is also the
recommendation from `jest` framework. The framework automatically loads all tests under `__tests__` folder.

#### Run Tests from Command Line

Tests can be executed using the command below:

```shell
npm run test
```

#### Run Tests from IDE

To run tests from IDE, ensure the [config file](jest.config.json) is passed to the executor.

### Code Format

The project uses prettier to format code. The below command can be used to format the code.

```shell
npx prettier --config .prettierrc --write .
```

> Note: If any of the files are not formatted, then the es-lint will throw an error as part of the CI job.
