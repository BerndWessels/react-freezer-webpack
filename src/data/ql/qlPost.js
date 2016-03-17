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
        resolve: (dbPost, {offset, limit}) => {
            var args = {};
            if(offset !== undefined) args.offset = offset;
            if(limit !== undefined) args.limit = limit;
            return dbPost.getComments(args);
        }
    }
}