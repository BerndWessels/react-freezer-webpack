/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * This will execute a given JSON command.
 * @param commands An object with all available commands (i.e. {updatePerson: (jsonCommand)=>{...}, ...}).
 * @param jsonCommand The command to be processed.
 */
export default function (commands, jsonCommand) {
    if(commands.hasOwnProperty(jsonCommand.id)) {
        return commands[jsonCommand.id](jsonCommand);
    } else {
        console.log('Unknown Command !!!', jsonCommand);
        return false;
    }
}
