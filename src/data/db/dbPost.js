/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Create the database entity.
 */
export default function (sequelize, DataTypes) {
    // Define the model.
    var model = sequelize.define('Post', {
            // Declare the properties.
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            // Prevent automatic table naming.
            freezeTableName: true,
            // Declare the associations.
            classMethods: {
                associate: function (models) {
                    model.belongsTo(models.User);
                    model.hasMany(models.Comment);
                }
            }
        }
    );
    // Create the model.
    return model;
}