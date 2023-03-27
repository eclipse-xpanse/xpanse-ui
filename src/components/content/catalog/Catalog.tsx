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
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import { CategoryOclVo, VersionOclVo } from '../../../xpanse-api/generated';
import { Tree } from 'antd';

function Catalog(): JSX.Element {
    const [key, setKey] = useState<React.Key>('');
    const [serviceDetails, setServiceDetails] = useState<JSX.Element>(<></>);
    const [serviceTree, setServiceTree] = useState<JSX.Element>(<></>);
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [categoryOclData, setCategoryOclData] = useState<CategoryOclVo[]>([]);
    const location = useLocation();

    const onSelect = (selectedKeys: React.Key[]) => {
        setKey(selectedKeys[0]);
    };

    useEffect(() => {
        const path: string = location.hash.split('#')[1];
        if (!path) {
            return;
        }
        serviceVendorApi.listRegisteredServicesTree(path).then((data) => {
            setCategoryOclData(data);
            let tData: DataNode[] = [];
            data.forEach((service) => {
                let dn: DataNode = {
                    title: service.name,
                    key: service.name || '',
                    children: [],
                };
                const versionList: VersionOclVo[] = service.versions || [];
                versionList.forEach((v: VersionOclVo) => {
                    dn.children!.push({
                        title: v.version,
                        key: service.name + '@' + v.version,
                    });
                });
                tData.push(dn);
            });
            setTreeData(tData);
            setServiceDetails(<></>);
            setServiceTree(<></>);
        });
    }, [location]);

    useEffect(() => {
        setServiceTree(
            <Tree defaultExpandAll={true} autoExpandParent={true} onSelect={onSelect} treeData={treeData} />
        );
    }, [treeData]);

    useEffect(() => {
        if (treeData.length === 0 || isParentTreeSelected() || key === '' || key === undefined) {
            setServiceDetails(<></>);
        } else {
            setServiceDetails(
                <div className={'right-class'}>
                    <div className={'left-title-class'}>Cloud Provider</div>
                    <ServiceProvider categoryOclData={categoryOclData} serviceName={key.toString()} />
                </div>
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    function isParentTreeSelected(): boolean {
        let isParentNode: boolean = false;
        treeData.forEach((dataNode: DataNode) => {
            if (dataNode.key === key) {
                isParentNode = true;
            }
        });
        return isParentNode;
    }

    return (
        <div className={'catalog-middleware'}>
            <div className={'container'}>
                <div className={'left-class'}>
                    <div className={'left-title-class'}>
                        <HomeOutlined />
                        &ensp;Service Tree
                    </div>
                    {serviceTree}
                </div>
                <div className={'middle-class'}></div>
                {serviceDetails}
            </div>
        </div>
    );
}

export default Catalog;
