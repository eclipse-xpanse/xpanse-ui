/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { HomeOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { category, ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import {
    catalogPageRoute,
    serviceCspQuery,
    serviceHostingTypeQuery,
    serviceNameKeyQuery,
    serviceVersionKeyQuery,
} from '../../../../utils/constants';
import { getAllKeysFromCatalogTree } from '../../../common/catalog/catalogProps';
import { filterNodes } from '../../../common/tree/filterTreeData';
import ServiceProvider from '../details/ServiceProvider';
import { ServiceTree } from './ServiceTree';

export function CatalogFullView({
    treeData,
    categoryOclData,
    category,
}: {
    treeData: DataNode[];
    categoryOclData: Map<string, ServiceTemplateDetailVo[]>;
    category: category;
}): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState('');

    const serviceNameInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceNameKeyQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }, [urlParams]);

    const serviceVersionInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceVersionKeyQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }, [urlParams]);
    const navigate = useNavigate();
    const allKeysInTree: React.Key[] = getAllKeysFromCatalogTree(treeData);
    const [selectKey, setSelectKey] = useState<React.Key>(getDefaultSelectedKey());
    const [isViewDisabled, setIsViewDisabled] = useState<boolean>(false);
    // necessary to store previous selected key to check and reuse previous values where possible.
    const previousSelectedKey = useRef<React.Key>(getDefaultSelectedKey());

    function getDefaultSelectedKey() {
        //if user directly opens an url.
        if (serviceNameInQuery && serviceVersionInQuery) {
            if (allKeysInTree.includes(serviceNameInQuery + '@' + serviceVersionInQuery)) {
                return serviceNameInQuery + '@' + serviceVersionInQuery;
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
                            void navigate({
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
                            void navigate({
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
        setSelectKey(selectedKeys[0]);
    };

    return (
        <>
            <div className={catalogStyles.leftClass}>
                <div className={catalogStyles.leftTitleClass}>
                    <HomeOutlined />
                    &nbsp;Service Tree
                </div>
                <ServiceTree
                    treeData={filterNodes(treeData, searchValue)}
                    selectKey={selectKey}
                    onSelect={onSelect}
                    setSearchValue={setSearchValue}
                    isViewDisabled={isViewDisabled}
                />
            </div>
            <div className={catalogStyles.middleClass} />
            <div className={catalogStyles.rightClass}>
                <div className={catalogStyles.leftTitleClass}>Cloud Provider</div>
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
