/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import '../../../styles/catalog.css';
import { DataNode } from 'antd/es/tree';
import ServiceProvider from './services/ServiceProvider';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { CategoryOclVo, ServicesAvailableService, ServiceVo, VersionOclVo } from '../../../xpanse-api/generated';
import { Empty, Tree } from 'antd';

function Catalog(): JSX.Element {
    const [selectKey, setSelectKey] = useState<React.Key>('');
    const [expandKeys, setExpandKeys] = useState<React.Key[]>([]);
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [categoryOclData, setCategoryOclData] = useState<CategoryOclVo[]>([]);
    const location = useLocation();
    const [unregisteredDisabled, setUnregisteredDisabled] = useState<boolean>(false);

    useEffect(() => {
        const category = location.hash.split('#')[1] as ServiceVo.category;
        ServicesAvailableService.getAvailableServicesTree(category)
            .then((data) => {
                const tData: DataNode[] = [];
                const tExpandKeys: React.Key[] = [];
                if (data.length > 0) {
                    setCategoryOclData(data);
                    data.forEach((service) => {
                        const dn: DataNode = {
                            title: service.name,
                            key: service.name || '',
                            children: [],
                        };
                        const versionList: VersionOclVo[] = service.versions;
                        versionList.forEach((v: VersionOclVo) => {
                            dn.children?.push({
                                title: v.version,
                                key: service.name + '@' + v.version,
                            });
                            tExpandKeys.push(service.name + '@' + v.version);
                        });
                        tData.push(dn);
                    });
                    setTreeData(tData);
                    setSelectKey(data[0].name + '@' + data[0].versions[0].version);
                    setExpandKeys(tExpandKeys);
                } else {
                    setTreeData([]);
                    setSelectKey('');
                    setExpandKeys([]);
                    setCategoryOclData([]);
                }
            })
            .catch((error: Error) => {
                console.log(error.message);
                setTreeData([]);
                setSelectKey('');
                setExpandKeys([]);
                setCategoryOclData([]);
            });
    }, [location]);

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

    const onConfirmUnregister = (disabled: boolean) => {
        setUnregisteredDisabled(disabled);
    };

    return (
        <div className={'catalog-middleware'}>
            {treeData.length === 0 || isParentTreeSelected(selectKey) || selectKey === '' ? (
                <div className={'service-blank-class'}>
                    <Empty description={'No services available.'} />
                </div>
            ) : (
                <div className={'container'}>
                    <div className={'left-class'}>
                        <div className={'left-title-class'}>
                            <HomeOutlined />
                            &nbsp;Service Tree
                        </div>
                        <Tree
                            defaultExpandAll={true}
                            autoExpandParent={true}
                            onSelect={onSelect}
                            selectedKeys={[selectKey]}
                            expandedKeys={expandKeys}
                            treeData={treeData}
                            disabled={unregisteredDisabled}
                        />
                    </div>
                    <div className={'middle-class'} />
                    <div className={'right-class'}>
                        <div className={'left-title-class'}>Cloud Provider</div>
                        <ServiceProvider
                            categoryOclData={categoryOclData}
                            serviceName={selectKey.toString()}
                            confirmUnregister={onConfirmUnregister}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Catalog;
