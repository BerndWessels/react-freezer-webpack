/**
 * Import Database Access.
 */
import db from '../db/db';

export default {
    nodes: {
        type: 'Comment',
        resolve: (qlCommentConnection) => {
            return qlCommentConnection.nodes;
        }
    }
}