/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Freezer from 'freezer-js';
import app from './app/store';
import schema from './data/ql/qlClientSchema';

const store = new Freezer({
    locale: 'en',
    app: app,
    // Entity cache is not pluralized to better reflect types.
    entities: {
        // TODO entities type caches get created if they don't exist. maybe no need to create them here?
        User: {},
        Post: {},
        PostConnection: {},
        Comment: {}
    }
}, {
    mutable: true
});

export default store;

export function createReaction(exports, name, handler, trigger) {
    store.on(name, handler);
    exports[name.replace(/:/g, '_')] = trigger ? trigger : (...args) => {
        store.trigger(name, ...args);
    };
}

export function getEntity(type, id) {
    const state = store.get();
    return state.entities[type][id];
}

export function getEntities(type, ids) {
    if(!Array.isArray(ids)){
        return [];
    }
    const state = store.get();
    var entities = [];
    ids.forEach(id => {
        if (state.entities[type].hasOwnProperty(id)) {
            entities.push(state.entities[type][id]);
        }
    });
    return entities;
}

export function getEntitiesFromConnection(connectionType, connectionId) {
    if(!connectionId){
        return [];
    }
    var entities = [];
    var nodeType = schema[connectionType].nodes.type;
    const state = store.get();
    state.entities[connectionType][connectionId].nodes.forEach((nodeId) => {
        if (state.entities[nodeType].hasOwnProperty(nodeId)) {
            entities.push(state.entities[nodeType][nodeId]);
        }
    });
    return entities;
}

export function setEntity(type, updatedEntity) {
    const state = store.get();
    let entities = state.entities[type].transact();
    entities[updatedEntity.id] = updatedEntity;
    state.entities[type].run();
}

export function setEntities(type, updatedEntities) {
    const state = store.get();
    let entities = state.entities[type].transact();
    updatedEntities.forEach(updatedEntity => {
        entities[updatedEntity.id] = updatedEntity;
    });
    state.entities[type].run();
}