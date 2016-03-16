"use strict";
module.exports = {
    parse: function(q) {
        let rootNode = {props: {}, params: null};
        let currentPath = [];

        function currentNode() {
            var currentNode = rootNode;
            currentPath.forEach((_nodeName)=> {
                currentNode = currentNode.props[_nodeName];
            });
            return currentNode;
        }

        let b = '';
        let i = 0;
        do {
            while (/[\s{]/.test(q[i])) i++;
            if(/\(/.test(q[i])){
                i++;
                let quotes = false;
                let p = '';
                while(!(/\)/.test(q[i]) && !quotes)){
                    if(/"/.test(q[i]) && !/\\/.test(q[-1])) quotes = !quotes;
                    p += q[i++];
                }
                //console.log('param', p.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
                currentNode().props[b].params = JSON.parse('{' + p.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ') + '}');
                while (/\s/.test(q[++i]));
            }
            b = '';
            while (!/[\s{}(]/.test(q[i])) b += q[i++];
            while (/\s/.test(q[i])) i++;
            if(/{/.test(q[i])){
                currentNode().props[b] = {props: {}, params: null};
                currentPath.push(b);
                //console.log('new node', b);
                i++;
            }
            else if(/}/.test(q[i])){
                if(b.length > 0){
                    currentNode().props[b] = {props: {}, params: null};
                    //console.log('new prop', b);
                }
                currentPath.pop();
                //console.log('close node');
                i++;
            }
            else{
                currentNode().props[b] = {props: {}, params: null};
                //console.log('new prop', b);
            }
        } while (i < q.length);

        /*
        q.match(/\s*(.*)[\s{]/g).forEach((_node, _nodeIndex)=> {
            _node = _node.trim();
            let params = {};
            let _params = _node.match(/\((.*)\)/); // TODO this can break!
            if (_params) {
                _params[1].match(/([^,:\s]+)/g).forEach((_param, _paramIndex, _paramArray)=> {
                    if (_paramIndex % 2 === 0) {
                        params[_param] = _paramArray[_paramIndex + 1];
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
                let match = _node.match(/^([\w]+)/);
                if(match) {
                    let _nodeName = match[1];
                    currentNode().props[_nodeName] = {props: null, params: params};
                }
            }
        });
        */

        return rootNode;
    }
}