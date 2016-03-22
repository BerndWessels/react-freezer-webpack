/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import task from './lib/task';
import schema from '../src/data/ql/qlSchema';

// Save JSON of full schema introspection for Babel Relay Plugin to use
export default task('update schema', async () => {
    let clientSchema = {};
    for (let type in schema) {
        clientSchema[type] = {};
        for (let prop in schema[type]) {
            clientSchema[type][prop] = {type: schema[type][prop].type}
        }
    }
    var output = `export default ${JSON.stringify(clientSchema, null, 2)}`;
    fs.writeFile(path.join(__dirname, '../src/data/ql/qlSchema.client.js'), output);
});
