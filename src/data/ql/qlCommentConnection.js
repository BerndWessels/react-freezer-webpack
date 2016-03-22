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
import db from '../db/db';

export default {
    nodes: {
        type: 'Comment',
        resolve: (qlCommentConnection) => {
            return qlCommentConnection.nodes;
        }
    }
}