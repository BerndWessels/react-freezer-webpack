import {default as store, createReaction, setEntity, setEntities} from '../../store';
import {processQueryResult} from './processor';
import schema from '../../data/ql/qlClientSchema';

export default function (query, update) {
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
            let state = store.get();
            let entities = state.entities.transact();
            let queryValue = processQueryResult(schema, entities, result);
            console.log(entities);
            state.entities.run();
            return queryValue;
        });
    });
}