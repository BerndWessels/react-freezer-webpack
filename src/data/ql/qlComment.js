/**
 * Import Database Access.
 */
import db from '../db/db';

export default {
    post: {
        type: 'Post',
        resolve: (dbComment) => {
            return dbComment.getPost();
        }
    }
}
