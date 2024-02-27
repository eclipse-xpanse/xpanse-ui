/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { HomeOutlined } from '@ant-design/icons';
import ServiceProvider from '../details/ServiceProvider';
import React, { useEffect, useRef, useState } from 'react';
import { ServiceTree } from './ServiceTree';
import { DataNode } from 'antd/es/tree';
import { DeployedService, ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    catalogPageRoute,
    serviceCspQuery,
    serviceHostingTypeQuery,
    serviceNameKeyQuery,
    serviceVersionKeyQuery,
} from '../../../../utils/constants';
import { getAllKeysFromCatalogTree } from '../../../common/catalog/catalogProps';

export function CatalogFullView({
    treeData,
    categoryOclData,
    category,
}: {
    treeData: DataNode[];
    categoryOclData: Map<string, ServiceTemplateDetailVo[]>;
    category: DeployedService.category;
}): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const navigate = useNavigate();
    const allKeysInTree: React.Key[] = getAllKeysFromCatalogTree(treeData);
    const [selectKey, setSelectKey] = useState<React.Key>(getDefaultSelectedKey());
    const [isViewDisabled, setIsViewDisabled] = useState<boolean>(false);
    // necessary to store previous selected key to check and reuse previous values where possible.
    const previousSelectedKey = useRef<React.Key>(getDefaultSelectedKey());

    function getDefaultSelectedKey() {
        //if user directly opens a url.
        if (urlParams.get(serviceNameKeyQuery) && urlParams.get(serviceVersionKeyQuery)) {
            if (
                allKeysInTree.includes(urlParams.get(serviceNameKeyQuery) + '@' + urlParams.get(serviceVersionKeyQuery))
            ) {
                return urlParams.get(serviceNameKeyQuery) + '@' + urlParams.get(serviceVersionKeyQuery);
            }
        }
        return allKeysInTree[0];
    }

    // useEffect necessary since we are updating URL outside the React context.
    useEffect(() => {
        if (allKeysInTree.length > 0) {
            const [name, version] = selectKey.toString().split('@');
            const serviceTemplates = categoryOclData.get(name);
            if (serviceTemplates) {
                for (const value of serviceTemplates) {
                    if (value.version === version) {
                        if (selectKey.toString() === previousSelectedKey.current.toString()) {
                            navigate({
                                pathname: catalogPageRoute,
                                hash: '#' + category,
                                search: createSearchParams({
                                    csp: urlParams.get(serviceCspQuery) ?? value.csp,
                                    serviceName: urlParams.get(serviceNameKeyQuery) ?? name,
                                    version: urlParams.get(serviceVersionKeyQuery) ?? version,
                                    hostingType: urlParams.get(serviceHostingTypeQuery) ?? value.serviceHostingType,
                                }).toString(),
                            });
                        } else {
                            previousSelectedKey.current = selectKey;
                            navigate({
                                pathname: catalogPageRoute,
                                hash: '#' + category,
                                search: createSearchParams({
                                    csp: value.csp,
                                    serviceName: name,
                                    version: version,
                                    hostingType: value.serviceHostingType,
                                }).toString(),
                            });
                        }
                        break;
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectKey]);

    return (
        <>
            <div className={'left-class'}>
                <div className={'left-title-class'}>
                    <HomeOutlined />
                    &nbsp;Service Tree
                </div>
                <ServiceTree
                    treeData={treeData}
                    selectKey={selectKey}
                    setSelectKey={setSelectKey}
                    isViewDisabled={isViewDisabled}
                />
            </div>
            <div className={'middle-class'} />
            <div className={'right-class'}>
                <div className={'left-title-class'}>Cloud Provider</div>
                <ServiceProvider
                    categoryOclData={categoryOclData}
                    selectedServiceNameInTree={selectKey.toString().split('@')[0]}
                    selectedServiceVersionInTree={selectKey.toString().split('@')[1]}
                    category={category}
                    isViewDisabled={isViewDisabled}
                    setIsViewDisabled={setIsViewDisabled}
                />
            </div>
        </>
    );
}
