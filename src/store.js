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
    app: app
});

export default store;

export function createReaction(store, exports, name, handler, trigger) {
    store.on(name, handler);
    exports[name.replace(':', '_')] = trigger ? trigger : (...args) => {
        store.trigger(name, ...args);
    };
}