/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Ways to get the data:
 *
 * 1. Individual SQL queries for each node.
 *    Currently we basically make a query on each instantiated data node.
 *    This results in a lot of individual sql select statements but might be just OK in many cases.
 * 2. A single sql query at the root only.
 *    We could dynamically build only one query at root level based on the ql query with joins to get all the data.
 *    Then each node (resolve) would find its requested data within this big dataset.
 *    It very much depends on the data whether to use method 1 or 2.
 * 3. A single no-sql query at the root only.
 *    If the root node translates to a no-sql object we could just query this at the root node.
 *    Then each node (resolve) would find its requested data within the no-sql object tree.
 *
 * Whatever method you use just keep in mind that you might have to support the ql connections concept.
 */

/**
 * Import Database Access.
 */
import db from '../db/db';

/**
 * Import QL Types.
 */
import Comment from './qlComment';
import CommentConnection from './qlCommentConnection';
import Post from './qlPost';
import PostConnection from './qlPostConnection';
import User from './qlUser';

/**
 * Export the query language schema.
 */
export default {
    // The entry point for all queries.
    Query: {
        viewer: {
            type: 'User',
            resolve: (_) => {
                return db.User.findOne({where: {id: 1}});
            }
        }
    },
    // Declare all entity types.
    Comment: Comment,
    CommentConnection: CommentConnection,
    Post: Post,
    PostConnection: PostConnection,
    User: User
}