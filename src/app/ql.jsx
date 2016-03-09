var q = `
user {
    ${App.user}
}
`;
export function App() {
    var user = `
        tickets {
            ${TicketList.tickets}
        }
        currentTicket {
            ${TicketDetails.ticket}
        }
        report {
            ${TicketDetails.report}
        }
    `;
    return (
        <App user={this.props.user}>
            <TicketList tickets={this.props.user.tickets}/>
            <TicketDetails ticket={this.props.user.currentTicket} report={this.props.report}/>
        </App>
    );
}
export function TicketList() {
    var tickets = `
        ${TicketListItem.ticket}
    `;
    return (
        <ul>
            {this.props.tickets.map((ticket)=>
                <TicketListItem ticket={ticket}/>
            )}
        </ul>
    );
}
export function TicketListItem() {
    var ticket = `
        title
    `;
    return (
        <div>
            <div>{this.props.ticket.title}</div>
        </div>
    );
}
export function TicketDetails() {
    var ticket = `
        title
        content
        user {
            email
        }
    `;
    var report = `
        overallStatus
    `;
    return (
        <div>
            <div>{this.props.ticket.title}</div>
            <div>{this.props.ticket.content}</div>
            <div>{this.props.ticket.user.email}</div>
            <div>{this.props.report.overallStatus}</div>
        </div>
    );
}

export function bla() {
    return `
        user {
            tickets {
                title
            }
            currentTicket {
                title
                content
                user {
                    email
                }
            }
            report {
                overallStatus(controlType: ${this.props.statusControlType})
            }
        }
    `;
}

/////////////////////////////////////////////////////////////

var query =
{
    user: {
        props: {
            tickets: {
                props: {
                    title: null
                }
            },
            currentTicket: {
                props: {
                    title: null,
                    content: null,
                    user: {
                        props: {
                            email: null
                        }
                    }
                }
            },
            report: {
                props: {
                    overallStatus: {
                        params: {
                            controlType: 4711           //// compare query : maybe this is the only diff  4711 => 815
                        }                               ////   new query will be only: user.report.overallStatus(controlType: 815)
                    }
                }
            }
        }
    }
}

home_initalize(){
    gql.exec(store, Home.getGraphQuery()); // this will update the entities in the store's state resulting in a new state
}

class User {
    firstName(args) {
        return this.firstName;
    }
    tickets(args) {
        return db.user(this.id).tickets();
    }
    currentTicket(args) {
        return db.user(this.id).currentTicket();          // what about user.email here?
    }
    report(args) {
        return db.user(this.id).report();
    }
}