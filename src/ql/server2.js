"use strict";

const q = require('q');
const parser = require('./parser');
const _ = require('lodash');








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

const User = {
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
};

class Something {
    constructor() {
        this.tickets = {
            type: 'Bernd'
        };
        this.bla = {
            type: Something
        }
    }
}

var x = new Something();

console.log(x);
for(let d in x){
    console.log(d);
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
        resolve: (dbTicket, args) => {
            console.log(args);
            var deferred = q.defer();
            setTimeout(()=> {
                deferred.resolve(dbTicket.owner);
            }, 200);
            return deferred.promise;
        }
    }
};

const Report = {
    overallStatus: {
        type: null,
        resolve: (dbTicket) => {
            return dbTicket.overallStatus;
        }
    }
};

const Query = {
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
};
















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

function executeQuery(jsonQuery, queryType) {
    queryNode(jsonQuery, queryType, null).then((result)=> {
        //console.log(JSON.stringify(result, null, 2))
        processQueryResult(result);
    });
}

function queryNode(node, nodeType, nodeData) {
    let result = nodeData && nodeData.hasOwnProperty('id') ? {id: nodeData.id} : {};
    let dataPromises = [];
    let dataPromisesMeta = [];
    let nodePromises = [];
    let nodePromisesMeta = [];
    // Resolve all properties of this node.
    for (let propName in node.props) {
        let propData = null;
        let isPromised = false;
        let propType = nodeType[propName];
        if (!propType) {
            propData = nodeData[propName];
        } else if (!propType.hasOwnProperty('resolve')) {
            propData = nodeData[propName];
        } else {
            let resolved = propType.resolve(nodeData, node.props[propName].params);
            if (!q.isPromiseAlike(resolved)) {
                propData = resolved;
            } else {
                isPromised = true;
                dataPromisesMeta.push(propName);
                dataPromises.push(resolved);
            }
        }
        // Process already resolved properties right away.
        if (propData !== null) {
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
        } else if (!isPromised) {
            result[propName] = null;
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


function processQueryResult(jsonQueryResult) {
    processQueryResultNode(jsonQueryResult, Query, null);
    console.log(JSON.stringify(entities, null, 2));
}

let entities = {
    User: {},
    Ticket: {},
    Report: {}
};

function processQueryResultNode(node, nodeType, entityType) {
    for (let propName in node) {
        let prop = node[propName];
        let propType = nodeType[propName];
        if (propType && propType.type && prop !== null) {
            if (Array.isArray(prop)) {
                let propItemIds = [];
                prop.forEach((propItem) => {
                    propItemIds.push(processQueryResultNode(propItem, typeFromString(propType.type), propType.type));
                });
                node[propName] = propItemIds;
            } else {
                node[propName] = processQueryResultNode(prop, typeFromString(propType.type), propType.type);
            }
        }
    }
    if(entityType) {
        entities[entityType][node.id] = _.omit(node, 'id');
    }
    return node.id;
}









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

var jsonQuery = parser.parse(qlQuery);

executeQuery(jsonQuery, Query);

