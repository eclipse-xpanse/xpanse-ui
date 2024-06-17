/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';

export function RegisteredServicesTree({
    treeData,
    selectedKeyInTree,
    setSelectedKeyInTree,
}: {
    treeData: DataNode[];
    selectedKeyInTree: React.Key;
    setSelectedKeyInTree: (selectedKey: React.Key) => void;
}): React.JSX.Element {
    function isParentTreeSelected(selectedKeyInTree: React.Key): boolean {
        let isParentNode: boolean = false;
        treeData.forEach((dataNode: DataNode) => {
            if (dataNode.key === selectedKeyInTree) {
                isParentNode = true;
            }
        });
        return isParentNode;
    }

    const onSelect = (selectedKeys: React.Key[]) => {
        if (selectedKeys.length === 0 || isParentTreeSelected(selectedKeys[0])) {
            return;
        }
        setSelectedKeyInTree(selectedKeys[0]);
    };

    return (
        <Tree
            showIcon={true}
            defaultExpandAll={true}
            autoExpandParent={true}
            onSelect={onSelect}
            selectedKeys={[selectedKeyInTree]}
            treeData={treeData}
        />
    );
}
