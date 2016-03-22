/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {default as store, createReaction, setEntity, fetchQuery} from '../../store';
import Home from './home';
import PostPanel from '../../components/postPanel/postPanel';

/**
 * Export all reactions.
 */
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
    fetchQuery(Home.getQuery()).then((queryValue) => {
        const state = store.get();
        let home = state.app.home.transact();
        home.loading = false;
        home.isInitialized = true;
        home.viewer = queryValue.viewer;
        state.app.home.run();
    });
});

/**
 * Update the range of comments to display for the given post.
 */
createReaction(exports, 'comments:range:update', (postsId, post, offset, limit) => {
    if (isNaN(parseInt(offset, 10)) || isNaN(parseInt(limit, 10)))
        return;
    fetchQuery(`viewer {
               posts(id: ${postsId}, ids: [${post.id}]) {
                   nodes {
                       ${PostPanel.getQuery(post.comments, offset, limit)}
                   }
               }
           }`,
        (entities, entityType, node) => {
            // Do not update the PostConnection since we only want to
            // update one of its Posts rather than replacing all Posts.
            if (entityType === 'PostConnection' && node.id === postsId) {
                return true;
            }
        }
    ).then((queryValue) => {
        //console.log(queryValue, store.get().entities);
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

/**
 * Export all reactions.
 */
module.exports = exports;
