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
import classnames from 'classnames';

/**
 * Import Entities.
 */
import {getEntity} from '../store';

/**
 * Import Reactions.
 */
import {locale_toggle} from './reactions';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import {Link} from 'react-router';

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
        children: React.PropTypes.node.isRequired,
        history: React.PropTypes.object.isRequired,
        location: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        route: React.PropTypes.object.isRequired,
        routeParams: React.PropTypes.object.isRequired,
        routes: React.PropTypes.array.isRequired,
        state: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
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

    // Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
    // At this point in the lifecycle, you can access any refs to your children
    // (e.g., to access the underlying DOM representation).
    // The componentDidMount() method of child components is invoked before that of parent components.
    // If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval,
    // or send AJAX requests, perform those operations in this method.
    componentDidMount() {
    }

    // Invoked when a component is receiving new props. This method is not called for the initial render.
    // Use this as an opportunity to react to a prop transition before render() is called
    // by updating the state using this.setState(). The old props can be accessed via this.props.
    // Calling this.setState() within this function will not trigger an additional render.
    componentWillReceiveProps(nextProps) {
    }

    // Invoked before rendering when new props or state are being received.
    // This method is not called for the initial render or when forceUpdate is used.
    // Use this as an opportunity to return false
    // when you're certain that the transition to the new props and state will not require a component update.
    // If shouldComponentUpdate returns false, then render() will be completely skipped until the next state change.
    // In addition, componentWillUpdate and componentDidUpdate will not be called.
    shouldComponentUpdate(nextProps, nextState) {
        // This is not a pure component.
        // Basically the whole store's state is a prop which means
        // we always have to update the component when the store's state changes.
        return true;
    }

    // Invoked immediately before rendering when new props or state are being received.
    // This method is not called for the initial render.
    // Use this as an opportunity to perform preparation before an update occurs.
    // You cannot use this.setState() in this method.
    // If you need to update state in response to a prop change, use componentWillReceiveProps instead.
    componentWillUpdate(nextProps, nextState) {
    }

    // Invoked immediately after the component's updates are flushed to the DOM.
    // This method is not called for the initial render.
    // Use this as an opportunity to operate on the DOM when the component has been updated.
    componentDidUpdate(prevProps, prevState) {
    }

    // Invoked immediately before a component is unmounted from the DOM.
    // Perform any necessary cleanup in this method,
    // such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.
    componentWillUnmount() {
    }

    // Render the component.
    render() {
        // Get the properties.
        const {children, state} = this.props;
        // Get the entities.
        var user = getEntity('User', 1);
        // Calculate the styles.
        const className = classnames(style.root);
        // Return the component UI.
        return (
            <div className={className}>
                <Link to="/">Home</Link>
                <br/>
                <Link to="/settings">Settings</Link>
                <div onClick={() => locale_toggle('A debug message!', true)}>
                    <FormattedMessage id="app.button"
                                      description="A button in the application page."
                                      defaultMessage="Button"/>
                </div>
                <h1>{user ? user.firstName : 'NOTHING TO SEE HERE'}</h1>
                {children}
            </div>
        );
    }
}
