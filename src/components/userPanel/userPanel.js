/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';

/**
 * Import Entities.
 */
import {getEntities, getEntitiesFromConnection} from '../../store';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import PostPanel from '../postPanel/postPanel';

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
export default class UserPanel extends React.Component {
    // Expected properties.
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        handleUserUpdate: React.PropTypes.func.isRequired
    };

    // Initialize the component.
    constructor(props) {
        super(props);
    }

    // Invoked before rendering when new props or state are being received.
    // This method is not called for the initial render or when forceUpdate is used.
    // Use this as an opportunity to return false
    // when you're certain that the transition to the new props and state will not require a component update.
    // If shouldComponentUpdate returns false, then render() will be completely skipped until the next state change.
    // In addition, componentWillUpdate and componentDidUpdate will not be called.
    shouldComponentUpdate(nextProps, nextState) {
        // This is a pure component.
        return React.addons.shallowCompare(this, nextProps, nextState);
    }

    // Invoked before requesting data for this component.
    static getQuery() {
        return `firstName
                email
                posts {
                    nodes {
                        ${PostPanel.getQuery()}
                    }
                }`;
    }

    // Render the component.
    render() {
        // Get the properties.
        const {user, handleUserUpdate, handleUserSave, comments_range_update} = this.props;
        // Get the posts.
        var posts = getEntitiesFromConnection('PostConnection', user.posts);
        // Calculate the styles.
        let className = style.root;
        // Return the component UI.
        return (
            <div className={className}>
                <input type="text" value={user.firstName}
                       onChange={(e) => handleUserUpdate(Object.assign({}, user, {firstName: e.target.value}))}/>
                <input type="button" value="Save" onClick={(e) => handleUserSave(user)}/>
                <ul>
                    {posts.map(post => {
                        return (
                            <li key={post.id}>
                                <PostPanel post={post}
                                           comments_range_update={(offset, limit) => comments_range_update(user.posts, post, offset, limit)}/>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
