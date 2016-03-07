/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {default as store, createReaction} from '../store';

let exports = {};

/**
 * Toggle the locale.
 */
createReaction(store, exports, 'locale:toggle', (a, b) => {
    console.log(a, b);
    fetch('http://tiny-url.info/api/v1/random', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify({
            url: 'www.google.com'
        })
    }).then((response) => {
        console.log(response);
    });
    const state = store.get();
    state.set('locale', state.locale == 'en' ? 'de' : 'en');
});

module.exports = exports;
