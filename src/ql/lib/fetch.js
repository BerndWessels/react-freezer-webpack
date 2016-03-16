import {default as store, createReaction, setEntity, setEntities} from '../../store';
import {processQueryResult} from './processor';
import schema from '../../data/ql/qlClientSchema';

export default function (query) {
    return fetch('http://127.0.0.1:8088', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Client-ID dc708f3823b7756',
            "Content-type": "application/json; charset=UTF-8"
        },
        //mode: 'no-cors',
        body: JSON.stringify({
            query: query
        })
    }).then(response => {
        return response.json().then(result => {
            //console.log(result);
            let state = store.get();
            let entities = state.entities.transact();
            //{
            //    User: state.entities.User.transact(),
            //    Post: state.entities.User.transact(),
            //    Comment: state.entities.User.transact()
            //};
            //let users = state.entities.User.transact();
            //users[5] = {a: 1};
            //entities['User'][1] = {a: 1};
            // The result of the query will be the root object of that query.
             let queryValue = processQueryResult(schema, entities, result);
            // The result of the query will update the client's entity cache.
            //console.log(JSON.stringify(entities, null, 2));
            //
            state.entities.run();
            //state.entities.User.run();
            //state.entities.Post.run();
            //state.entities.Comment.run();
            //state = store.get();
            //console.log(state.entities);
            return queryValue;
        });
    });
}