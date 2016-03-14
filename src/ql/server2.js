"use strict";

const q = require('q');
const parser = require('./parser');

let dbUser = {
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
}

const User = {
    tickets: {
        type: 'Ticket',
        resolve: (dbUser) => {
            var deferred = q.defer();
            setTimeout(()=> {
                deferred.resolve(dbUser.tickets);
            }, 1000);
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
}

const Ticket = {
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
        resolve: (dbTicket) => {
            var deferred = q.defer();
            setTimeout(()=> {
                deferred.resolve(dbTicket.owner);
            }, 2000);
            return deferred.promise;
        }
    }
}

const Report = {
    overallStatus: {
        type: null,
        resolve: (dbTicket) => {
            return dbTicket.overallStatus;
        }
    }
}

function typeFromString(type) {
    switch (type.replace(/[\[\]]/g, '')) {
        case 'User':
            return User;
        case 'Ticket':
            return Ticket;
        case 'Report':
            return Report;
    }
}

var qlQuery = `
    viewer {
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

var jsonQuery = parser.parse(qlQuery);

//console.log(JSON.stringify(jsonQuery, null, 2));

const Query = {
    viewer: {
        type: 'User',
        resolve: (_) => {
            var deferred = q.defer();
            setTimeout(()=> {
                deferred.resolve(dbUser);
            }, 2000);
            return deferred.promise;
        }
    }
};

executeQuery(jsonQuery, Query);

function executeQuery(jsonQuery, queryType) {
    queryNode(jsonQuery, queryType, null).then((result)=> {
        console.log(JSON.stringify(result, null, 2))
    });
}

function queryNode(node, nodeType, nodeData) {
    let result = {};
    let dataPromises = [];
    let dataPromisesMeta = [];
    let nodePromises = [];
    let nodePromisesMeta = [];
    // Resolve all properties of this node.
    for (let propName in node.props) {
        let propData = null;
        let propType = nodeType[propName];
        if (!propType) {
            propData = nodeData[propName];
        } else if (!propType.hasOwnProperty('resolve')) {
            propData = nodeData[propName];
        } else {
            let resolved = propType.resolve(nodeData /*, propArgs */);
            if (!q.isPromiseAlike(resolved)) {
                propData = resolved;
            } else {
                var x = true;
                dataPromisesMeta.push(propName);
                dataPromises.push(resolved);
            }
        }
        // Process already resolved properties right away.
        if (propData) {
            if (propType && propType.type) {
                let propNode = node.props[propName];
                if (Array.isArray(propData)) {
                    propData.forEach((propDataItem) => {
                        nodePromisesMeta.push({propName, isArray: true});
                        nodePromises.push(queryNode(propNode, typeFromString(propType.type), propDataItem));
                    });
                } else {
                    nodePromisesMeta.push({propName});
                    nodePromises.push(queryNode(propNode, typeFromString(propType.type), propData));
                }
            } else {
                result[propName] = propData;
            }
        } else if(!x) {
            result[propName] = null;
            console.log(propName);
            x = false;
        }
    }
    // Process remaining properties once they are resolved.
    return q.allSettled(dataPromises)
        .then(function (resolvePromisesResults) {
            resolvePromisesResults.forEach((resolvePromisesResult, resolvePromisesResultIndex) => {
                let propName = dataPromisesMeta[resolvePromisesResultIndex];
                let propData = resolvePromisesResult.value;
                let propType = nodeType[propName];
                let propNode = node.props[propName];
                if (propData) {
                    if (propType && propType.type) {
                        if (Array.isArray(propData)) {
                            propData.forEach((propDataItem) => {
                                nodePromisesMeta.push({propName, isArray: true});
                                nodePromises.push(queryNode(propNode, typeFromString(propType.type), propDataItem));
                            });
                        } else {
                            nodePromisesMeta.push({propName});
                            nodePromises.push(queryNode(propNode, typeFromString(propType.type), propData));
                        }
                    } else {
                        result[propName] = propData;
                    }
                }
            });
            return q.allSettled(nodePromises).then((nodePromisesResults)=> {
                nodePromisesResults.forEach((nodePromisesResult, nodePromisesResultIndex) => {
                    let propName = nodePromisesMeta[nodePromisesResultIndex].propName;
                    let isArray = nodePromisesMeta[nodePromisesResultIndex].isArray;
                    let propData = nodePromisesResult.value;
                    if (isArray) {
                        result[propName] ? result[propName].push(propData) : result[propName] = [propData];
                    } else {
                        result[propName] = propData;
                    }
                });
                return result;
            });
        });
}
