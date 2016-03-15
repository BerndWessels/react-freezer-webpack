/**
 * Import Database Access.
 */
import db from '../db/db';

export default {
    posts: {
        type: 'Post',
        resolve: (dbUser) => {
            return dbUser.getPosts();
        }
    }
}