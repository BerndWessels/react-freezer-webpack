/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import data creation helpers.
 */
import _ from 'lodash';
import Faker from 'faker';
import q from 'q';

/**
 * Import Database Access.
 */
import db from '../src/data/db/db';

import task from './lib/task';

/**
 * Create/override database with fake data.
 */
export default task('create/override fake database', async () => {
    await db.sequelize.sync({force: true})
        .then(() => {
            // Create 10 persons.
            return q.all(_.times(10, () => {
                return createUser();
            }));
        });
});

function createUser() {
    return db.User.create({
            firstName: Faker.name.firstName(),
            lastName: Faker.name.lastName(),
            email: Faker.internet.email(),
            language: 'en'
        })
        .then(dbUser => {
            // Create 10 posts for each user.
            return q.all(_.times(10, (n) => {
                return createPost(dbUser, n);
            }));
        });
}

function createPost(dbUser, index) {
    return dbUser.createPost({
            title: `Post ${index} by ${dbUser.firstName}`,
            content: `Post ${index} for ${dbUser.lastName}`
        })
        .then(dbPost => {
            // Create 10 comments for each post.
            return q.all(_.times(10, (n) => {
                return createComment(dbPost, n);
            }));
        });
}

function createComment(dbPost, index) {
    return dbPost.createComment({
        content: `Comment ${index} for [${dbPost.title}]`
    });
}