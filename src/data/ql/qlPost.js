/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import Database Access.
 */
import {getConnectionWithTotal} from '../db/db';

export default {
    user: {
        type: 'User',
        resolve: (dbPost) => {
            return dbPost.getUser();
        }
    },
    comments: {
        type: 'CommentConnection',
        resolve: (dbPost, args) => {
            return getConnectionWithTotal({postId: dbPost.id}, 'Comment', args);
        }
    }
}