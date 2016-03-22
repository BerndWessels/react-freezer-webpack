/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import q from 'q';

/**
 * The database that the schema will access.
 */
const dbUser = {
    id: 0,
    email: 'bernd@wessels.de',
    tickets: [
        {
            id: 10,
            title: 'ticket 0',
            content: 'content 0',
            owner: {
                id: 1,
                tickets: null,
                currentTicket: null,
                report: null,
                email: 'user@ticket.0'
            }
        },
        {
            id: 11,
            title: 'ticket 1',
            content: 'content 1',
            owner: {
                id: 2,
                tickets: null,
                currentTicket: null,
                report: {
                    id: 101,
                    overallStatus: 815
                },
                email: null
            }
        }
    ],
    currentTicket: {
        id: 12,
        title: 'ticket c',
        content: 'content c',
        owner: {
            id: 3,
            tickets: null,
            currentTicket: null,
            report: null,
            email: 'user@ticket.c'
        }
    },
    report: {
        id: 100,
        overallStatus: 4711
    }
};

/**
 * The query language schema.
 */
export default {
    schema: {
        Query: {
            viewer: {
                type: 'User',
                resolve: (_) => {
                    var deferred = q.defer();
                    setTimeout(()=> {
                        deferred.resolve(dbUser);
                    }, 200);
                    return deferred.promise;
                }
            }
        },
        User: {
            tickets: {
                type: 'Ticket',
                resolve: (dbUser) => {
                    var deferred = q.defer();
                    setTimeout(()=> {
                        deferred.resolve(dbUser.tickets);
                    }, 100);
                    return deferred.promise;
                }
            },
            currentTicket: {
                type: 'Ticket',
                resolve: (dbUser) => {
                    return dbUser.currentTicket;
                }
            },
            report: {
                type: 'Report',
                resolve: (dbUser) => {
                    return dbUser.report;
                }
            }
        },
        Ticket: {
            title: {
                type: null,
                resolve: (dbTicket) => {
                    return dbTicket.title;
                }
            },
            content: {
                type: null,
                resolve: (dbTicket) => {
                    return dbTicket.content;
                }
            },
            owner: {
                type: 'User',
                resolve: (dbTicket, args) => {
                    var deferred = q.defer();
                    setTimeout(()=> {
                        deferred.resolve(dbTicket.owner);
                    }, 200);
                    return deferred.promise;
                }
            }
        },
        Report: {
            overallStatus: {
                type: null,
                resolve: (dbTicket) => {
                    return dbTicket.overallStatus;
                }
            }
        }
    }
}
