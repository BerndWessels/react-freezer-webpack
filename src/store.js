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
    entities: {
        user: [{
            id: 1,
            firstName: 'Bernd',
            lastName: 'Wessels'
        }, {
            id: 2,
            firstName: 'Christine',
            lastName: 'Caballo'
        }, {
            id: 3,
            firstName: 'Sophie Anne',
            lastName: 'Caballo Wessels'
        }, {
            id: 4,
            firstName: 'John Paul',
            lastName: 'Caballo Wessels'
        }]
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
    // TODO possible index === -1 once we find a way to cleanup the cache?
    state.entities[type].set(index, updatedEntity);
}