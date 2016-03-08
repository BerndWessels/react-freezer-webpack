/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {default as store, createReaction, setEntity} from '../../store';

let exports = {};

/**
 * Toggle the locale.
 */
createReaction(exports, 'something:update', (value) => {
    const state = store.get();
    state.app.home.set('something', value).now();
}, (value) => {
    store.trigger('something:update', value + '@');
});

createReaction(exports, 'user:update', (updatedUser) => {
    // TODO maybe add validation here or in the trigger?
    setEntity('user', updatedUser);
});

module.exports = exports;
