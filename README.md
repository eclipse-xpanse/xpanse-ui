# Xpanse UI

This is the frontend for the Xpanse project which allows cloud service providers to register managed services to the
service catalog and also for end users to deploy services from the service catalog and manage them.

## Development Setup

Project is built using `ReactJS` library. As we use `TypeScript` here, we must ensure all objects have its type explicit
defined.

GUI components are built using `antd` library.

Authentication and authorization is built using `Zitadel`.

### Configuration Properties

All required configuration parameters required must be added to .env file [here](.env). Even if there is on valid
default value, we can add just add empty value. This file serves as reference to all required properties

We use two different ways of reading configuration properties for the application.

#### .env Files

1. Set values in the .env files. All default values are set in .env files. These are automatically loaded by `React` and
   there is no need to do anything for this to be loaded.
2. For non-default properties or to override the values is .env, we can set the values in new .env files and load them
   using `env-cmd` framework which will automatically inject the variables. Example can be
   found [here](package.json#L20)

#### Environment Variables

All variables can be overridden by setting environment variables and then running the npm start or build scripts.

### Starting local development server

In the project directory, you can run the below command to start the local development server. This also additionally
needs `nodejs` to be installed on the development machine.

If there is a local development Zitadel instance, then we must set `REACT_APP_ZITADEL_CLIENT_ID` environment variable
and then run the below command.

```shell
$ npm run start
```

If you wish to use our central Zitadel testbed instance, then simply start the application with below command.

```shell
$ npm run start-with-zitadel-testbed
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Generate Rest Client for Xpanse API

We use the openapi generator to generate data models and rest client from the openapi json file.
The following steps must be followed to generate new client and datamodels whenever there is a new version if the
swagger json.

1. Copy the openapi file to [OpenApi JSON File](src/xpanse-api/api.json)
2. Run the code generator as below
    ```shell
        cd src/xpanse-api
        npx openapi-typescript-codegen --input api.json --output ./generated --exportSchemas false
    ```
    This step will generate all required models and client
3. Add license headers.
4. Format newly generated files.

## Build for production

The build must ensure that all configuration parameters are correctly set. We can either export the parameters as
environment variables or add `.env` files and execute the build command as below.

```shell
$ npm run build
```

Builds the app for production to the `build` folder. Contents can be copied to any webserver to host the frontend files.

> Note: Since the UI application is completely browser based, all configuration parameters must be injected directly to
> the application at build time. No configuration can be updated at runtime.

## Docker Image

Docker image for the UI project is based on nginx base image. This because the project only serves static content.

### Pre-requisites

Before the docker image can be built, all requirements parameters must be set and then the following steps must be executed so that all dependent files are generated.

```shell
npm install && \
npm run build
```

### Build Image

TO build image, run the below command.

```shell
docker build  -t xpanse-ui -f docker/Dockerfile .
```

### Run UI Container

Container runs the application on port `80` by default. If you want the application to be reachable on port 3000 for
development purposes, then the container can be started as below.

```shell
docker run -d -p 3000:80 --name ui xpanse-ui
```

### Application Logs

All logs from nginx is routed to stdout by default. Using the below command, all application logs can be viewed.

```shell
docker logs ui
```

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
