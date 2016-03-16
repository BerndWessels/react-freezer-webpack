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
import {getEntities} from '../../store';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import CommentPanel from '../commentPanel/commentPanel';

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
export default class PostPanel extends React.Component {
    // Expected properties.
    static propTypes = {
        post: React.PropTypes.object.isRequired
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

    // Render the component.
    render() {
        // Get the properties.
        const {post} = this.props;
        // Get the comments.
        var comments = getEntities('Comment', post.comments);
        // Calculate the styles.
        let className = style.root;
        // Return the component UI.
        return (
            <div className={className}>
                <div>{post.title}</div>
                <ul>
                    {comments.map(comment => {
                        return (
                            <li key={comment.id}>
                                <CommentPanel comment={comment}/>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
