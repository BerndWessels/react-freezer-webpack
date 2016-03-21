/**
 * Import Database Access.
 */
import {getConnection} from '../db/db';

export default {
    posts: {
        type: 'PostConnection',
        resolve: (dbUser, args) => {
            return getConnection(dbUser, 'getPosts', args);
        }
    }
}