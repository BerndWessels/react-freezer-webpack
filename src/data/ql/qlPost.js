/**
 * Import Database Access.
 */
import db from '../db/db';

export default {
    user: {
        type: 'User',
        resolve: (dbPost) => {
            return dbPost.getUser();
        }
    },
    comments: {
        type: 'Comment',
        resolve: (dbPost) => {
            return dbPost.getComments();
        }
    }
}