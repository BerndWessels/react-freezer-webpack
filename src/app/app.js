/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */

/**
 * Import styles.
 */
import style from './style';

/**
 * Import Internationalization.
 */
import {IntlProvider, FormattedMessage} from 'react-intl';

/**
 * The component.
 */
export default class extends React.Component {
    // Expected properties.
    static propTypes = {
        children: React.PropTypes.node.isRequired
    };

    // Expected context properties.
    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    // Initialize the component.
    constructor(props) {
        super(props);
    }

    // Invoked once, both on the client and server, immediately before the initial rendering occurs.
    // If you call setState within this method,
    // render() will see the updated state and will be executed only once despite the state change.
    componentWillMount() {
    }

    // Invoked when a component is receiving new props. This method is not called for the initial render.
    // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
    // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
    componentWillReceiveProps(nextProps, nextContext) {
    }

    // Render the component.
    render() {
        // Get the application state.
        var state = this.context.store.get();
        // Get the properties.
        const {children} = this.props;
        // Calculate the styles.
        let className = style.root;
        // Return the component UI.
        return (
            <div className={className}>
                <h1>{JSON.stringify(state)}</h1>
                {children}
            </div>
        );
    }
}
