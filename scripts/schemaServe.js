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
import parseQuery from'../src/ql/lib/parseQuery';
import processQuery from '../src/ql/lib/processQuery';
import schema from '../src/data/ql/qlSchema';

/**
 * Serves the GraphQL data endpoint.
 */
export default task('serve data', async () => {
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
        //console.log(JSON.stringify(req.headers, null, 2));
        //console.log(req.body.query.trim());
        let jsonQuery = parseQuery(req.body.query.trim());
        //console.log(JSON.stringify(jsonQuery, null, 2));
        processQuery(schema, jsonQuery).then((result)=> {
            //console.log(result);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
    });
    // Run the server.
    server.listen(GRAPHQL_PORT, () => console.log(
        `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
    ));
});
