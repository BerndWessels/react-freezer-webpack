/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * This will parse a query language query and turn it into a JSON query tree.
 * @param q The query language query string to be parsed.
 */
export default function(q) {
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
        while (!/[\s{}(]/.test(q[i])) b += q[i++];
        while (/\s/.test(q[i])) i++;
        if (/{/.test(q[i])) {
            currentNode().props[b] = {props: {}, params: null};
            currentPath.push(b);
            //console.log('new node', b);
            i++;
        }
        else if (/}/.test(q[i])) {
            if (b.length > 0) {
                currentNode().props[b] = {props: {}, params: null};
                //console.log('new prop', b);
            }
            currentPath.pop();
            //console.log('close node');
            i++;
        }
        else {
            currentNode().props[b] = {props: {}, params: null};
            //console.log('new prop', b);
        }
        if (/\(/.test(q[i])) {
            i++;
            let quotes = false;
            let p = '';
            while (!(/\)/.test(q[i]) && !quotes)) {
                if (/"/.test(q[i]) && !/\\/.test(q[-1])) quotes = !quotes;
                p += q[i++];
            }
            //console.log('param', p.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
            let params = JSON.parse('{' + p.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ') + '}')
            i++;
            while (/\s/.test(q[i])) i++;
            if (/{/.test(q[i])) {
                currentNode().props[b] = {props: {}, params: params};
                currentPath.push(b);
                //console.log('new node', b);
                i++;
            }
            else {
                currentNode().props[b].params = params;
            }
        }
        b = '';
    } while (i < q.length);

    return rootNode;
}