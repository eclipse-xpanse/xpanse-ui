/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Key } from "antd/es/table/interface";
import React from "react";

function ServiceTree({
    treeData,
    setKey,
}: {
    treeData: DataNode[];
    setKey: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
    const onSelect = (selectedKeysValue: Key[]) => {
        setKey(selectedKeysValue[0].toString());
    };

    return (
        <>
            <Tree defaultExpandAll={true} autoExpandParent={true} onSelect={onSelect} treeData={treeData} />
        </>
    );
}

export default ServiceTree;
