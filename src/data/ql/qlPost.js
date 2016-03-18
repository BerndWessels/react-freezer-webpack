/**
 * Import Database Access.
 */
import db from '../db/db';

var connectionCounter = 0;

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
            let id = args && args.hasOwnProperty('id') && args.id !== undefined ? args.id : ++connectionCounter;
            let params = {};
            if (args && args.hasOwnProperty('ids') && args.ids !== undefined) params.where = {id: {in: args.ids}};
            if (args && args.hasOwnProperty('offset') && args.offset !== undefined) params.offset = args.offset;
            if (args && args.hasOwnProperty('limit') && args.limit !== undefined) params.limit = args.limit;
            return dbPost.getComments(params).then(dbComments => {
                return {id: id, nodes: dbComments};
            });
        }
    }
}