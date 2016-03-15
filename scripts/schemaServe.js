/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import cors from 'cors';
import express from'express';
import bodyParser from 'body-parser';
import task from './lib/task';
import {parse} from'../src/ql/lib/parser';
import {executeQuery} from '../src/ql/lib/processor';
import schema from '../src/data/ql/qlSchema';

/**
 * Serves the GraphQL data endpoint.
 */
export default task('serve data', async () => {


    let query = `
    viewer {
        email
    }`;
    let jsonQuery = parse(query);
    console.log(JSON.stringify(jsonQuery,null, 2));
    return;


    // Development data port.
    const GRAPHQL_PORT = 8088;

    // Create a GraphQL endpoint.
    var server = express();

    // Enable CORS during development.
    server.use(cors());
    server.use(bodyParser.json());
    // Log every incoming query.
    server.use((req, res, next) => {
        console.log('Time:', Date.now());
        next();
    });
    // Expose the GraphQL endpoint.
    server.use((req, res, next) => {
        console.log(JSON.stringify(req.headers, null, 2));
        console.log(req.body.query.trim());
        let jsonQuery = parse(req.body.query.trim());
        jsonQuery = `
    viewer {
        email
    }
`;

        console.log(JSON.stringify(jsonQuery, null, 2));
        //executeQuery(sampleSchema.schema, jsonQuery).then((result)=> {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ a: 1 }));
        //let jsonQuery = parser.parse(qlQuery);
        //executeQuery(sampleSchema.schema, jsonQuery).then((result)=> {
    });
    // Run the server.
    server.listen(GRAPHQL_PORT, () => console.log(
        `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
    ));
});
