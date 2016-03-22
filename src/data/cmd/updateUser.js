/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import _ from 'lodash';

/**
 * Import database access.
 */
import db from '../db/db';

/**
 * Export the command.
 */
export default function (jsonCommand) {
    return db.User.update(_.omit(jsonCommand.user, ['id', 'posts']), {where: {id: jsonCommand.user.id}});
}