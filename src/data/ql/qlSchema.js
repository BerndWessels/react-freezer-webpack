/**
 * Import Database Access.
 */
import db from '../db/db';

/**
 * Import QL Types.
 */
import User from './qlUser';
import Post from './qlPost';
import PostConnection from './qlPostConnection';
import Comment from './qlComment';
import CommentConnection from './qlCommentConnection';

export default {
    Query: {
        viewer: {
            type: 'User',
            resolve: (_) => {
                return db.User.findOne({where: {id: 1}});
            }
        }
    },
    User: User,
    Post: Post,
    PostConnection: PostConnection,
    Comment: Comment,
    CommentConnection: CommentConnection
}

/* Ways to get the data:
1. Individual SQL queries for each node.
   Currently we basically make a query on each instanciated data node.
   This results in a lot of individual sql select statements.
2. A single sql query at the root only.
   We could only do a single query at root level with joins to get all the data.
   Then each node (resolve) would find its requested data within this big dataset.
3. A single no-sql query at the root only.
   If the root node translates to a no-sql object we could just query this at the root node.
   Then each node (resolve) would find its requested data within the no-sql object tree.
 */