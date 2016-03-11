"use strict";
module.exports = {
    parse: function(query) {
        let rootNode = {props: {}, params: null};
        let currentPath = [];

        function currentNode() {
            var currentNode = rootNode;
            currentPath.forEach((_nodeName)=> {
                currentNode = currentNode.props[_nodeName];
            });
            return currentNode;
        }

        query.match(/\s*(.*)[\s{]/g).forEach((_node, _nodeIndex)=> {
            _node = _node.trim();
            let params = [];
            let _params = _node.match(/\((.*)\)/); // TODO this can break!
            if (_params) {
                _params[1].match(/([^,:\s]+)/g).forEach((_param, _paramIndex, _paramArray)=> {
                    if (_paramIndex % 2 === 0) {
                        params.push({[_param]: _paramArray[_paramIndex + 1]});
                    }
                });
            }
            if (_node[_node.length - 1] === '{') {
                let _nodeName = _node.match(/^([\w]+)/)[1];
                currentNode().props[_nodeName] = {props: {}, params: params};
                currentPath.push(_nodeName);
            } else if (_node === '}') {
                currentPath.pop();
            } else {
                let _nodeName = _node.match(/^([\w]+)/)[1];
                currentNode().props[_nodeName] = {props: null, params: params};
            }
        });

        return rootNode;
    }
}