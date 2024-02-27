/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tree } from 'antd';
import React from 'react';
import { DataNode } from 'antd/es/tree';

export function ServiceTree({
    treeData,
    selectKey,
    setSelectKey,
    isViewDisabled,
}: {
    treeData: DataNode[];
    selectKey: React.Key;
    setSelectKey: (selectedKey: React.Key) => void;
    isViewDisabled: boolean;
}): React.JSX.Element {
    function isParentTreeSelected(selectKey: React.Key): boolean {
        let isParentNode: boolean = false;
        treeData.forEach((dataNode: DataNode) => {
            if (dataNode.key === selectKey) {
                isParentNode = true;
            }
        });
        return isParentNode;
    }

    const onSelect = (selectedKeys: React.Key[]) => {
        if (selectedKeys.length === 0 || isParentTreeSelected(selectedKeys[0])) {
            return;
        }
        setSelectKey(selectedKeys[0]);
    };

    return (
        <Tree
            showIcon={true}
            defaultExpandAll={true}
            autoExpandParent={true}
            onSelect={onSelect}
            selectedKeys={[selectKey]}
            treeData={treeData}
            disabled={isViewDisabled}
        />
    );
}
