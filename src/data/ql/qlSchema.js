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