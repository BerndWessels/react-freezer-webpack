/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {IndexRoute, Route} from 'react-router';

/**
 * Import Features.
 */
import App from './app/app';
import Home from './app/home/home';
import Settings from './app/settings/settings';

/**
 * The application's routing structure.
 */
export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/settings" component={Settings}/>
    </Route>
);
