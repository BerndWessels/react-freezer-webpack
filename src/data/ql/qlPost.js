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