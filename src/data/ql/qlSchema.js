/**
 * Import Database Access.
 */
import db from '../db/db';

/**
 * Import QL Types.
 */
import User from './qlUser';
import Post from './qlPost';
import Comment from './qlComment';

export default {
    Query: {
        viewer: {
            type: 'User',
            resolve: (_) => {
                return db.User.findOne({where: {id: 2}});
            }
        }
    },
    User: User,
    Post: Post,
    Comment: Comment
}