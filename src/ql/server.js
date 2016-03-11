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
            user: {
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
            user: {
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
        user: {
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
                console.log('!!!!!!!!');
                deferred.resolve(dbUser.tickets);
            }, 2000);
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
    user: {
        type: 'User',
        resolve: (dbTicket) => {
            return dbTicket.user;
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
    user {
        tickets {
            title
            user(limit: 5, offset: 'none') {
                email
                report
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

//console.log(JSON.stringify(jsonQuery, null, 4));

executeQuery(jsonQuery);

function executeQuery(query) {
    //console.log(JSON.stringify({
    //    user: executeNode(query.props.user, User, dbUser);
    //}, null, '\t'));
    executeNode(query.props.user, User, dbUser).then((result) => console.log(JSON.stringify(result, null, 4)));
}

var stop = 0;

function executeNode(node, type, dbEntity) {
    let resolvePromises = [];
    let resolvePromisesMeta = [];
    if (node.hasOwnProperty('props')) {
        for (let propName in node.props) {
            let propNode = node.props[propName];
            let propType = type[propName] ? type[propName].type : null;
            resolvePromisesMeta.push({propName, propNode, propType});
            resolvePromises.push(propValue(propName, type, dbEntity));
        }
    }
    else {
        console.log('Not supported, but maybe in the future we want to return all props if none explicitly stated?!');
    }
    return q.allSettled(resolvePromises)
        .then(function (resolveResults) {
            let propsPromises = [];
            let propsPromisesMeta = [];
            resolveResults.forEach(function (resolveResult, resolveResultIndex) {
                let resolvedValue = resolveResult.value;
                let propName = resolvePromisesMeta[resolveResultIndex].propName;
                let propNode = resolvePromisesMeta[resolveResultIndex].propNode;
                let propType = resolvePromisesMeta[resolveResultIndex].propType;

                if (propNode !== null && propNode.hasOwnProperty('props') && propNode.props !== null) {
                    if (Array.isArray(resolvedValue)) {
                        resolvedValue.forEach((resolvedValueItem) => {
                            propsPromisesMeta.push({propName, isArray: true});
                            propsPromises.push(executeNode(propNode, typeFromString(propType), resolvedValueItem));
                        })
                    } else {
                        propsPromisesMeta.push({propName});
                        propsPromises.push(executeNode(propNode, typeFromString(propType), resolvedValue));
                    }
                } else {
                    propsPromisesMeta.push({propName});
                    propsPromises.push(q.fcall(()=>resolvedValue));
                }

            });
            return q.allSettled(propsPromises).then((propsResults)=> {
                var result = {};
                propsResults.forEach((propsResult, propsResultIndex) => {
                    let resolvedValue = propsResult.value;
                    let propName = propsPromisesMeta[propsResultIndex].propName;
                    let isArray = propsPromisesMeta[propsResultIndex].isArray;
                    if (isArray) {
                        result.hasOwnProperty(propName) ? result[propName].push(resolvedValue) : result[propName] = [resolvedValue];
                    } else {
                        result[propName] = resolvedValue;
                    }
                });
                return result;
            });
        });
}

function propValue(propName, propType, propData) {
    let resolvePromise;
    let resolveFunction = propType && propType[propName] ? propType[propName].resolve : null;
    if (resolveFunction) {
        var resolved = resolveFunction(propData);
        if (q.isPromiseAlike(resolved)) {
            resolvePromise = resolved;
        } else {
            resolvePromise = q.fcall(()=>resolved);
        }
    } else {
        resolvePromise = q.fcall(()=> {
            return propData[propName];
        });
    }
    return resolvePromise;
}

/*
 executeQuery({
 user: {
 props: {
 email: null,
 tickets: {
 props: {
 title: null,
 user: {
 props: {
 email: null
 }
 }
 }
 },
 currentTicket: {
 props: {
 title: null,
 content: null
 }
 },
 report: {
 props: {
 overallStatus: {
 params: {
 controlType: 4711
 }
 }
 }
 }
 }
 }
 });





 function executeNode(node, type, dbEntity) {
 var result = {
 id: dbEntity.id
 };
 if (node.hasOwnProperty('props')) {
 for (let prop in node.props) {
 let childNode = node.props[prop];
 var propType = type[prop] ? type[prop].type : null;
 var propValue = type[prop] ? type[prop].resolve(dbEntity) : dbEntity[prop];
 if (childNode !== null && childNode.hasOwnProperty('props') && childNode.props !== null) {
 if (Array.isArray(propValue)) {
 result[prop] = [];
 propValue.forEach((item) => {
 result[prop].push(executeNode(childNode, typeFromString(propType), item));
 })
 } else {
 result[prop] = executeNode(childNode, typeFromString(propType), propValue);
 }
 } else {
 result[prop] = propValue;
 }
 }
 }
 else {
 console.log('Not supported, but maybe in the future we want to return all props if none explicitly stated?!');
 }
 return result;
 }


 */