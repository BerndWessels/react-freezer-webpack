"use strict";

const parser = require('./parser');
const executeQuery = require('./processor').executeQuery;
const processQueryResult = require('./processor').processQueryResult;
const sampleSchema = require('./sampleSchema');

// Client sends this to the server.

var qlQuery = `
    viewer {
        id
        email
        tickets {
            title
            owner(limit: 5, offset: 'none') {
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
    }
`;

// Server parses it.

let jsonQuery = parser.parse(qlQuery);

// Server processes it.
executeQuery(sampleSchema.schema, jsonQuery).then((result)=> {

    // Server sends result back to the client.
    // ===>
    // Client processes the result.

    let entities = {
        User: {},
        Ticket: {},
        Report: {}
    };

    // The result of the query will be the root object of that query.
    console.log(processQueryResult(sampleSchema.schema, entities, result));

    // The result of the query will update the client's entity cache.
    console.log(JSON.stringify(entities, null, 2));
});
