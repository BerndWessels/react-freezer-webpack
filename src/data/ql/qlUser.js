/**
 * Import Database Access.
 */
import db from '../db/db';

var connectionCounter = 0;

export default {
    posts: {
        type: 'PostConnection',
        resolve: (dbUser, args) => {
            let id = args && args.hasOwnProperty('id') && args.id !== undefined ? args.id : ++connectionCounter;
            let params = {};
            if (args && args.hasOwnProperty('ids') && args.ids !== undefined) params.where = {id: {in: args.ids}};
            if (args && args.hasOwnProperty('offset') && args.offset !== undefined) params.offset = args.offset;
            if (args && args.hasOwnProperty('limit') && args.limit !== undefined) params.limit = args.limit;
            return dbUser.getPosts(params).then(dbPosts => {
                return {id: id, nodes: dbPosts};
            });
        }
    }
}