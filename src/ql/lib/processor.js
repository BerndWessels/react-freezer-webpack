"use strict";

const q = require('q');
const _ = require('lodash');

function executeQuery(schema, jsonQuery) {
    return queryNode(schema, jsonQuery, schema.Query, null);
}

function queryNode(schema, node, nodeType, nodeData) {
    let result = nodeData && nodeData.hasOwnProperty('id') ? {id: nodeData.id} : {};
    let dataPromises = [];
    let dataPromisesMeta = [];
    let nodePromises = [];
    let nodePromisesMeta = [];
    // Resolve all properties of this node.
    for (let propName in node.props) {
        let propData = null;
        let isPromised = false;
        let propType = nodeType[propName];
        if (!propType) {
            propData = nodeData[propName];
        } else if (!propType.hasOwnProperty('resolve')) {
            propData = nodeData[propName];
        } else {
            let resolved = propType.resolve(nodeData, node.props[propName].params);
            if (!q.isPromiseAlike(resolved)) {
                propData = resolved;
            } else {
                isPromised = true;
                dataPromisesMeta.push(propName);
                dataPromises.push(resolved);
            }
        }
        // Process already resolved properties right away.
        if (propData !== null) {
            if (propType && propType.type) {
                let propNode = node.props[propName];
                if (Array.isArray(propData)) {
                    propData.forEach((propDataItem) => {
                        nodePromisesMeta.push({propName, isArray: true});
                        nodePromises.push(queryNode(schema, propNode, schema[propType.type], propDataItem));
                    });
                } else {
                    nodePromisesMeta.push({propName});
                    nodePromises.push(queryNode(schema, propNode, schema[propType.type], propData));
                }
            } else {
                result[propName] = propData;
            }
        } else if (!isPromised) {
            result[propName] = null;
        }
    }
    // Process remaining properties once they are resolved.
    return q.allSettled(dataPromises)
        .then(function (resolvePromisesResults) {
            resolvePromisesResults.forEach((resolvePromisesResult, resolvePromisesResultIndex) => {
                let propName = dataPromisesMeta[resolvePromisesResultIndex];
                let propData = resolvePromisesResult.value;
                let propType = nodeType[propName];
                let propNode = node.props[propName];
                if (propData) {
                    if (propType && propType.type) {
                        if (Array.isArray(propData)) {
                            propData.forEach((propDataItem) => {
                                nodePromisesMeta.push({propName, isArray: true});
                                nodePromises.push(queryNode(schema, propNode, schema[propType.type], propDataItem));
                            });
                        } else {
                            nodePromisesMeta.push({propName});
                            nodePromises.push(queryNode(schema, propNode, schema[propType.type], propData));
                        }
                    } else {
                        result[propName] = propData;
                    }
                }
            });
            return q.allSettled(nodePromises).then((nodePromisesResults)=> {
                nodePromisesResults.forEach((nodePromisesResult, nodePromisesResultIndex) => {
                    let propName = nodePromisesMeta[nodePromisesResultIndex].propName;
                    let isArray = nodePromisesMeta[nodePromisesResultIndex].isArray;
                    let propData = nodePromisesResult.value;
                    if (isArray) {
                        result[propName] ? result[propName].push(propData) : result[propName] = [propData];
                    } else {
                        result[propName] = propData;
                    }
                });
                return result;
            });
        });
}


function processQueryResult(schema, entities, jsonQueryResult) {
    return processQueryResultNode(schema, entities, jsonQueryResult, schema.Query, null);
}

function processQueryResultNode(schema, entities, node, nodeType, entityType) {
    for (let propName in node) {
        let prop = node[propName];
        let propType = nodeType[propName];
        if (propType && propType.type && prop !== null) {
            if (Array.isArray(prop)) {
                let propItemIds = [];
                prop.forEach((propItem) => {
                    propItemIds.push(processQueryResultNode(schema, entities, propItem, schema[propType.type], propType.type));
                });
                node[propName] = propItemIds;
            } else {
                node[propName] = processQueryResultNode(schema, entities, prop, schema[propType.type], propType.type);
            }
        }
    }
    if (entityType) {
        entities[entityType][node.id] = _.omit(node, 'id');
        return node.id;
    } else {
        return node;
    }
}

module.exports = {
    executeQuery: executeQuery,
    processQueryResult: processQueryResult
}