# React / Freezer / Simplified GraphQL / Webpack

# Current Version 0.1.1

# Overview

This is a template you can fork and clone to develop data driven React/Freezer/Simplified GraphQL SPA Websites using a single QL endpoint.

It also shows how to integrate access to databases like mysql or postgres with sequelize.

We are using React-Intl V2 as our translation framework. It seems to be the best and most thought after project out there at the moment.
Even though it is still a pre-release it seems stable enough to be used already.

Another nice feature is the use of CSS modules. It removes all the trouble that usually comes with css naming conflicts.

To make AJAX calls we use fetch, which is available natively on modern browsers and polyfilled via webpack for old browsers.

And we will keep on adding other important SPA related components and processes for whitelabeling and everything else you need to kick-start your unicorn.

# Simplified GraphQL

This project uses Simplified GraphQL which is similar to Relay with GraphQL - but much much simpler and easier to use.

It also integrates fantastically with Freezer. And because it is so much simpler it gives you much more flexibility and freedom to adjust it to your needs.

For example, instead of having the highly complicated and very restricted Relay/GraphQL Mutations, we can just send simple JSON commands with Simplified GraphQL queries.
This Project shows how powerful and flexible this is.

# Why not Relay and GraphQL

Relay and GraphQL are just not ready yet. After spending a lot of time we just had to admit that it is way to complicated to achieve all the things we expect.

We will obviously follow Relay and GraphQL and might adopt it in the future, but for now Simplified GraphQL is just so much easier to use.

# Babel 6

We are strictly committed to the latest and greatest JavaScript developments and are using Babel 6.

Make sure you get the latest versions of all packages. Otherwise you might run into bugs that have already been fixed. `npm outdated` is your friend.

# Todo

Add a changelog to make it easier for followers to find relevant changes.

# Features
* React
* Freezer
* Simplified GraphQL
* CSS Modules
* SASS
* Sequelize MySQL/MSSQL/Postgres
* Webpack
* Browser Sync
* React Bootstrap
* React-Intl V2 Internationalization
* Heavily commented webpack configuration with reasonable defaults.
* Latest JSX, ES6, and ES7 support with babel 6.
* Source maps included in all builds.
* Development server with live reload.
* Production builds with cache busting and asset minification.
* Testing environment using chai and mocha.
* Code coverage when tests are run.
* No gulp and no grunt, just npm run-scripts.

# Getting Started

* Windows Users might want to install [Git Credential](https://chocolatey.org/packages/git-credential-winstore) Store.
  This will prevent you from getting stuck during npm installs that require your username and password.
* Install [NodeJS](https://nodejs.org/)
* Now make sure the web-site folder is the current folder.
* Install the node module dependencies: <code>npm install</code>
* In case there are problems while installing dependencies you can clean the repository caches: <code>npm cache clear</code>
* Sometimes company proxies can cause issues with GIT. A possible fix could be: <code>git config --global url."https://".insteadOf git://</code>

# Develop

First create the fake database. To do so update the `data/database/db.js` with the correct connection details to your database.

    /**
     * Create the database connection.
     */
    var sequelize = new Sequelize('schema', 'user', 'password', {
      host: '192.168.101.92',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });

Then create/override the database with fake data `npm run database:fake`

Now update/create the graphql schema `npm run schema:update`

Make sure the ports used are all available and run the graphql server `npm run schema:serve`

Now in another console you can start developing with `npm start`

That should automatically open a browser window on port 3000 and you are ready to go.

# Build Production

To build the production version of the client you first update/create the graphql schema `npm run schema:update`

Then run `npm run build`

This will create a `dist` folder with all the static production files and resources.

You can copy the `dist` content now to your production environment.

If you want to run the production version locally to make sure it works, you can run `npm run build:serve`.
This will serve the `dist` folder on port `8080`. Just make sure you serve the schema as well.

# i18n

We are using [react-intl v2](https://github.com/yahoo/react-intl/issues/162) to provide translations and internationalization.

For each language you want to provide you have to add a `[id].json` in the `public/assets/translations` folder.

To Extract the default messages from your project and merge them into all your language files run `npm run translations:extract`.
Already existing translations within your language files will not be touched. Only new default messages will be added.

You can also modify and extend the `translationsExtract` script with your own tools and workflows. This gives you plenty of ways to deal with your translator.

## Scripts

* `npm start` - start development server, try it by opening `http://localhost:8080/` or with browser sync `http://localhost:3000/`
* `npm run build` - generate a minified build to dist folder
* `npm run build:serve` - serve the minified build locally on port 8080
* `npm run test` - run all tests
* `npm run test:live` - continuously run unit tests watching for changes
* `npm run database:fake` - create/override the database with fake data
* `npm run schema:update` - update the Relay GraphQL schema
* `npm run schema:serve` - serve the Relay GraphQL data endpoint
* `npm run translations:extract` - extracts all default messages and merges them into the translations files.

See what each script does by looking at the `scripts` section in [package.json](./package.json).

# Contribution

You are very welcome to report issues and to contribute to the project.