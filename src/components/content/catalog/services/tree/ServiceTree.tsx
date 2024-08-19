/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Input, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';

const { Search } = Input;

export function ServiceTree({
    treeData,
    selectKey,
    onSelect,
    setSearchValue,
    isViewDisabled,
}: {
    treeData: DataNode[];
    selectKey: React.Key;
    onSelect: (selectedKey: React.Key[]) => void;
    setSearchValue: (searchValue: string) => void;
    isViewDisabled: boolean;
}): React.JSX.Element {
    return (
        <>
            <Search
                style={{ marginBottom: 8 }}
                placeholder={'Search by name or version'}
                title={'Search by name or version'}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                }}
                onSearch={(e) => {
                    setSearchValue(e);
                }}
            />
            <Tree
                showIcon={true}
                defaultExpandAll={true}
                autoExpandParent={true}
                onSelect={onSelect}
                selectedKeys={[selectKey]}
                treeData={treeData}
                disabled={isViewDisabled}
            />
        </>
    );
}
