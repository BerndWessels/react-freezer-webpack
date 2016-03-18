/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {default as store, createReaction, setEntity, setEntities} from '../../store';

import fetch from '../../ql/lib/fetch';

import Home from './home';
import PostPanel from '../../components/postPanel/postPanel';

let exports = {};

/**
 * Load initial homepage data.
 */
createReaction(exports, 'homepage:initialize', () => {
    const state = store.get();
    if (state.app.home.isInitialized) {
        return;
    }
    state.app.home.set('loading', true);
    fetch(Home.getQuery()).then((queryValue) => {
        const state = store.get();
        let home = state.app.home.transact();
        home.loading = false;
        home.isInitialized = true;
        home.viewer = queryValue.viewer;
        state.app.home.run();
    });
});

/**
 * Load initial homepage data.
 */
createReaction(exports, 'comments:limit:update', (post, limit) => {
    if (isNaN(parseInt(limit, 10)))
        return;
    console.log(post.comments);
    fetch(`viewer {
               posts(ids: [${post.id}]) {
                   nodes {
                       ${PostPanel.getQuery(post.comments, undefined, limit)}
                   }
               }
           }`, true
    ).then((queryValue) => {
        console.log(store.get().entities);
    });
});

/**
 * TODO this is just an example to show the use of custom reaction triggers.
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
    setEntity('User', updatedUser);
});

module.exports = exports;
