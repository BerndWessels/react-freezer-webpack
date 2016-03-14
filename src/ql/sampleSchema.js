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
