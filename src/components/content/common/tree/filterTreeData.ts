/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DataNode } from 'antd/es/tree';

export function filterNodes(nodes: DataNode[], searchValue: string): DataNode[] {
    return nodes
        .map((node) => {
            const matches = node.key.toString().toLowerCase().includes(searchValue.toLowerCase());

            if (!node.children) {
                return matches ? node : null;
            }
            const filteredChildren = filterNodes(node.children, searchValue);
            return filteredChildren.length > 0 || matches ? { ...node, children: filteredChildren } : null;
        })
        .filter(Boolean) as DataNode[];
}
