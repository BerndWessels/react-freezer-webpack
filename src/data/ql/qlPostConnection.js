/**
 * Import Database Access.
 */
import db from '../db/db';

export default {
    nodes: {
        type: 'Post',
        resolve: (qlPostConnection) => {
            return qlPostConnection.nodes;
        }
    }
}