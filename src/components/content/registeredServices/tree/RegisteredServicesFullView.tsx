/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { HomeOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useMemo, useState } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import catalogStyles from '../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../xpanse-api/generated';
import {
    registeredServicesPageRoute,
    serviceCategoryQuery,
    serviceNameKeyQuery,
    serviceVendorQuery,
    serviceVersionKeyQuery,
} from '../../../utils/constants.tsx';
import { getFourthLevelKeysFromAvailableServicesTree } from '../../common/registeredServices/registeredServiceProps.ts';
import { filterNodes } from '../../common/tree/filterTreeData';
import { RegisteredServicesTree } from './RegisteredServicesTree.tsx';
import ServiceContent from './ServiceContent.tsx';

export function RegisteredServicesFullView({
    treeData,
    availableServiceList,
}: {
    treeData: DataNode[];
    availableServiceList: ServiceTemplateDetailVo[];
}): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState('');

    const serviceVendorInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceVendorQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }, [urlParams]);

    const serviceCategoryInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceCategoryQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }, [urlParams]);

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
    const allKeysInTree: React.Key[] = getFourthLevelKeysFromAvailableServicesTree(treeData);

    const [selectedKeyInTree, setSelectedKeyInTree] = useState<React.Key>(getDefaultSelectedKey());

    function getDefaultSelectedKey() {
        //if user directly opens an url.
        if (serviceVendorInQuery && serviceCategoryInQuery && serviceNameInQuery && serviceVersionInQuery) {
            const fullKey = `${serviceVendorInQuery}@${serviceCategoryInQuery}@${serviceNameInQuery}@${serviceVersionInQuery}`;

            if (allKeysInTree.includes(fullKey)) {
                return fullKey;
            }
        }
        return allKeysInTree[0];
    }

    // useEffect necessary since we are updating URL outside the React context.
    useEffect(() => {
        let serviceVendor: string = '';
        let category: string = '';
        let name: string = '';
        let version: string = '';
        if (selectedKeyInTree && typeof selectedKeyInTree === 'string') {
            const parts = selectedKeyInTree.split('@');
            if (parts.length === 4) {
                serviceVendor = parts[0];
                category = parts[1];
                name = parts[2];
                version = parts[3];
            }
        }

        if (availableServiceList.length > 0) {
            for (const value of availableServiceList) {
                if (
                    value.serviceVendor === serviceVendor &&
                    value.category.toString() === category &&
                    value.name === name &&
                    value.version === version
                ) {
                    if (selectedKeyInTree.toString().length > 0) {
                        void navigate({
                            pathname: registeredServicesPageRoute,
                            search: createSearchParams({
                                serviceVendor: serviceVendor,
                                category: category,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeyInTree]);

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
        <>
            <div className={catalogStyles.leftClass}>
                <div className={catalogStyles.leftTitleClass}>
                    <HomeOutlined />
                    &nbsp;Services
                </div>
                <RegisteredServicesTree
                    treeData={filterNodes(treeData, searchValue)}
                    selectedKeyInTree={selectedKeyInTree}
                    onSelect={onSelect}
                    setSearchValue={setSearchValue}
                />
            </div>
            <div className={catalogStyles.middleClass} />
            <div className={catalogStyles.rightClass}>
                <div className={catalogStyles.leftTitleClass}>Service Details</div>
                <ServiceContent
                    availableServiceList={availableServiceList}
                    selectedServiceVendorInTree={selectedKeyInTree.toString().split('@')[0]}
                    selectedServiceCategoryInTree={selectedKeyInTree.toString().split('@')[1]}
                    selectedServiceNameInTree={selectedKeyInTree.toString().split('@')[2]}
                    selectedServiceVersionInTree={selectedKeyInTree.toString().split('@')[3]}
                />
            </div>
        </>
    );
}
