/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import parseQuery from './parseQuery';
import processQuery from './processQuery';
import processQueryResult from './processQueryResult';
import sampleSchema from './sampleSchema';

// Client sends this to the server.

var qlQuery = `
    viewer {
        id
        email
        tickets {
            title
            owner(limit: 5, offset: "none") {
                email
                report {
                    overallStatus
                }
            }
        }
        currentTicket {
            content
        }
        report {
            overallStatus
        }
    }`;

// Server parses it.

let jsonQuery = parseQuery(qlQuery);

// Server processes it.
processQuery(sampleSchema.schema, jsonQuery).then((result)=> {

    // Server sends result back to the client.
    // ===>
    // Client processes the result.

    // The client's entity cache.
    let entities = {};

    // The result of the query will be the root object of that query.
    console.log(processQueryResult(sampleSchema.schema, entities, result));

    // The result of the query will update the client's entity cache.
    console.log(JSON.stringify(entities, null, 2));
});
