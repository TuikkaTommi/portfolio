# Car-rental backend made with Serverless-framework

This is a serverless backend for managing an AWS DynamoDB-database that holds data of car rentals. It sets up the required services on AWS, and provides endpoints for manipulating the data. This project was made for the Backend 2 -course. Endpoints that require authorization, are authorized with JWT:s.

[Serverless.yml](https://github.com/TuikkaTommi/portfolio/blob/main/Serverless-AWS/car-rental-backend/serverless.yml) configures the necessary services inside AWS and sets up the endpoints for different API-methods. [Customer](https://github.com/TuikkaTommi/portfolio/tree/main/Serverless-AWS/car-rental-backend/customer)-folder holds the functions for interacting with the database. Each functionality has its own .js file. [ddbconn.js](https://github.com/TuikkaTommi/portfolio/blob/main/Serverless-AWS/car-rental-backend/customer/ddbconn.js)-file in this folder handles setting up the connection to the DynamoDB-database. It provides connection-methods for both DynamoDBClient and DynamoDBDocumentClient and exports them for other files to use. [Helpers/index.js](https://github.com/TuikkaTommi/portfolio/blob/main/Serverless-AWS/car-rental-backend/helpers/index.js) holds helper functions. Helper-functions exist for sending a response to the client and for validating user-input while creating new user. [User](https://github.com/TuikkaTommi/portfolio/tree/main/Serverless-AWS/car-rental-backend/user)-folder contains functions for both creating a new user and logging in an existing user.

When deployed, the following endpoints are provided:
- POST /user/login - receive users credentials and validate them to provide authorization token
- POST /user/signup - create a new user
- GET /customer/scan - return all customers saved to db
- GET /customer/get/:ccode - returns one customer with specific customercode (ccode)
- POST /customer/add - add a new customer to the db. Authorized endpoint
- POST /customer/upsertrental/:ccode - add a new rental to a customer. Authorized endpoint
- DELETE /customer/deletecustomer/:ccode - delete a customer with given customercode from db. Authorized endpoint
- GET /customer/getrentalsbydate/:date - returns all rentals from a specific date. Authorized endpoint
- GET /customer/getrentalsbylicense/:licensnumber - returns all rentals of a specific car. Authorized endpoint
- POST /customer/deleterental/:ccode/:rcode - delete a rental from db. Ccode is customercode and rcode is code of the rental to delete. Authorized endpoint
 


------------------------------------------------------------------------------------------------------------------------------------------------------------------

<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Framework Node HTTP API on AWS

This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

This template does not include any kind of persistence (database). For more advanced examples, check out the [serverless/examples repository](https://github.com/serverless/examples/) which includes Typescript, Mongo, DynamoDB and other examples.

## Usage

### Deployment

```
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying aws-node-http-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-http-api-project-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: aws-node-http-api-project-dev-hello (1.9 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to the following (removed `input` content for brevity):

```json
{
  "message": "Go Serverless v2.0! Your function executed successfully!",
  "input": {
    ...
  }
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Which should result in response similar to the following:

```
{
  "statusCode": 200,
  "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```


Alternatively, it is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
