# backend for daily-quotes-app

## Introduction
---
Typescript and Postgress back-end implementation for project daily-quotes-app, thanks to which the users can store and retrieve their favourite quotes.
The user can store the quote using an assigned text channel on Discord, through post request or using GraphQL mutation. Quote's retrieval is implemented
for last added quote.
In terms of libraries:
* For tracing: "@honeycombio/opentelemetry-node," "@opentelemetry/api," and "@opentelemetry/auto-instrumentations-node" help us track operations.
* "prom-client" captures various metrics effectively.
* Handling GraphQL: "@types/express-graphql," "@types/graphql," and "graphql" streamline our queries/mutations.
* The Discord bot, interacting with assigned channels, relies on "discord.js."
* Database management involves "pg," "@types/pg," "reflect-metadata," and "typeorm."

## User instructions
---
1. Clone this project
2. Set up .env file
3. Install dependencies
4. Start the project

### Setting up .env file
---
To configure your application with necessary environment variables, you need to create a `.env` file in the project directory. This file will store sensitive information and configuration settings securely. Below are the environment variables required for the application to run properly:

* `DB_NAME`: Your database name.
* `DB_PASSWORD`: Your database password.
* `HONEYCOMB_API_KEY`: Your Honeycomb API key for tracing.
* `OTEL_SERVICE_NAME`: The name of your service for tracing.
* `PORT`: The port on which your server will run.
* `DISCORD_GUILD_ID`: The ID of your Discord server (guild).
* `DISCORD_CHANNEL_ID`: The ID of the Discord text channel.
* `DISCORD_BOT_TOKEN`: Your Discord bot token.

### Install dependencies
`yarn install`

### Start the project
`yarn start`

##### OpenTelemetry start up
`yarn run tracing`

##### Start Prometheus and Grafana
`docker compose up`
