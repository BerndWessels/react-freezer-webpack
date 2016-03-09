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

const store = new Freezer({
    locale: 'en',
    app: app,
    // Entity cache is not pluralized to better reflect types.
    entities: {
        user: []
    }
});

export default store;

export function createReaction(exports, name, handler, trigger) {
    store.on(name, handler);
    exports[name.replace(':', '_')] = trigger ? trigger : (...args) => {
        store.trigger(name, ...args);
    };
}

export function getEntity(type, id) {
    const state = store.get();
    return state.entities[type].find(entity => id === entity.id);
}

export function getEntities(type, ids) {
    const state = store.get();
    return state.entities[type].filter(entity => {
        return ids.findIndex(id => id == entity.id) !== -1;
    });
}

export function setEntity(type, updatedEntity) {
    const state = store.get();
    var index = state.entities[type].findIndex(entity => entity.id === updatedEntity.id);
    if (index === -1) {
        state.entities[type].push(updatedEntity);
    } else {
        state.entities[type].set(index, updatedEntity);
    }
}

export function setEntities(type, updatedEntities) {
    const state = store.get();
    let entities = state.entities[type].transact();
    updatedEntities.forEach((updatedEntity) => {
        var index = entities.findIndex(entity => entity.id === updatedEntity.id);
        if (index === -1) {
            entities.push(updatedEntity);
        } else {
            entities[index] = updatedEntity;
        }
    });
    state.entities[type].run();
}