/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {default as store, createReaction, setEntity, setEntities} from '../../store';

let exports = {};
/**
 * Load initial homepage data.
 */
createReaction(exports, 'homepage:initialize', () => {
    {
        const state = store.get();
        if (state.app.home.isInitialized) {
            return;
        }
        state.app.home.set('loading', true);
    }
    // Fake server request.
    setTimeout(()=> {
        const serverResponse = {
            users: [{
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
        };
        setEntities('user', serverResponse.users);
        const state = store.get();
        let home = state.app.home.transact();
        home.loading = false;
        home.isInitialized = true;
        state.app.home.run();
    }, 1000);
});

/**
 * Toggle the locale.
 */
createReaction(exports, 'something:update', (value) => {
    const state = store.get();
    state.app.home.set('something', value).now();
}, (value) => {
    store.trigger('something:update', value + '@');
});

/**
 * Update a user.
 */
createReaction(exports, 'user:update', (updatedUser) => {
    // TODO maybe add validation here or in the trigger?
    setEntity('user', updatedUser);
});

module.exports = exports;
