"use strict";

const q = require('q');

let dbUser = {
    id: 0,
    email: 'bernd@wessels.de',
    tickets: [
        {
            id: 10,
            title: 'ticket 0',
            content: 'content 0',
            user: {
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
                tickets: null,
                currentTicket: null,
                report: null,
                email: null
            }
        }
    ],
    currentTicket: {
        id: 12,
        title: 'ticket c',
        content: 'content c',
        user: {
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
        type: '[Ticket]',
        resolve: (dbUser) => {
            return dbUser.tickets;
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

var query = `
    user {
        tickets {
            title
            user {
                email
            }
        currentTicket {
            content
        }
        report {
        }
`;

query.match(/\s*(.*)[\s{]/g).forEach((x, i)=>console.log(i, x));

var nodes = [];
var currentNode = null;
query.match(/\s*(.*)[\s{]/g).forEach((x, i)=>{
    if(x[x.length - 2] === '{'){
        console.log(x);
    }
});

/*
function executeQuery(query) {
    console.log(JSON.stringify({
        user: executeNode(query.user, User, dbUser)
    }, null, '\t'));
}

function executeNode(node, type, dbEntity) {
    var result = {
        id: dbEntity.id
    };
    if (node.hasOwnProperty('props')) {
        for (let prop in node.props) {
            let childNode = node.props[prop];
            var propType = type[prop] ? type[prop].type : null;
            var propValue = type[prop] ? type[prop].resolve(dbEntity) : dbEntity[prop];
            if (childNode !== null && childNode.hasOwnProperty('props')) {
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

function propValue(propName, nodeType, nodeValue) {
    let resolveFunction = nodeType[propName] ? nodeType[propName].resolve : null;
    if (resolveFunction) {
        var resolved = resolveFunction(nodeValue);
        if (Q.isPromiseAlike(resolved)) {
            return resolved;
        } else {
            return Q.fcall(()=>resolved);
        }
    }
}

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
    */