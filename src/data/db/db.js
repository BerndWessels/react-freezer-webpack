/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import file system access.
 */
import fs from 'fs';
import path from 'path';

/**
 * Import database access.
 */
import Sequelize from 'sequelize';

/**
 * Create the database connection.
 */
var sequelize = new Sequelize('manapaho', 'root', 'abcDEF123', {
    host: '192.168.101.58',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

/**
 * Create the database access.
 */
var db = {};

// Import all models.
fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "db.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

// Process all models.
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

// Configure the database access.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Exports database access.
 */
export default db;

/**
 * Export connection helpers.
 */
var connectionCounter = 0;

export function getConnection(dbEntity, getter, args) {
    let params = {};
    if (args && args.ids !== undefined) params.where = {id: {in: args.ids}};
    if (args && args.offset !== undefined) params.offset = args.offset;
    if (args && args.limit !== undefined) params.limit = args.limit;
    return dbEntity[getter](params).then(dbEntities => {
        return {
            id: args && args.id !== undefined ? args.id : ++connectionCounter,
            ids: args && args.ids !== undefined ? args.ids : [],
            nodes: dbEntities,
            offset: params.offset ? params.offset : 0,
            limit: params.limit ? params.limit : 0
        };
    });
}

export function getConnectionWithTotal(where, model, args) {
    var params = {
        where: where
    };
    if (args && args.ids !== undefined) Object.assign(params.where, {id: {in: args.ids}});
    if (args && args.offset !== undefined) params.offset = args.offset;
    if (args && args.limit !== undefined) params.limit = args.limit;

    try {

        return db.Comment.findAndCountAll(params).then(result => {
            return {
                id: args && args.id !== undefined ? args.id : ++connectionCounter,
                ids: args && args.ids !== undefined ? args.ids : [],
                nodes: result.rows,
                offset: params.offset ? params.offset : 0,
                limit: params.limit ? params.limit : 0,
                total: result.count
            };
        });

    }
    catch(x) {
        console.log(x);
    }
}