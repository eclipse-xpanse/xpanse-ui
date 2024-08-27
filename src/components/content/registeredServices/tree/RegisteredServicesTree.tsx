/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Input, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';

const { Search } = Input;

export function RegisteredServicesTree({
    treeData,
    selectedKeyInTree,
    onSelect,
    setSearchValue,
}: {
    treeData: DataNode[];
    selectedKeyInTree: React.Key;
    onSelect: (selectedKey: React.Key[]) => void;
    setSearchValue: (searchValue: string) => void;
}): React.JSX.Element {
    return (
        <>
            <Search
                style={{ marginBottom: 8 }}
                placeholder={'Search by category,name,version'}
                title={'Search by category, service name or version'}
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
                selectedKeys={[selectedKeyInTree]}
                treeData={treeData}
            />
        </>
    );
}
