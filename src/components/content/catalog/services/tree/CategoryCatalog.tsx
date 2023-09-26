/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import '../../../../../styles/catalog.css';
import { DataNode } from 'antd/es/tree';
import ServiceProvider from '../details/ServiceProvider';
import { HomeOutlined, TagOutlined } from '@ant-design/icons';
import { ApiError, Response, ServiceVo, UserAvailableServiceVo } from '../../../../../xpanse-api/generated';
import { Alert, Empty, Skeleton, Tree } from 'antd';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';
import { getServiceMapper, getVersionMapper } from '../../../common/catalog/catalogProps';
import { useAvailableServiceTemplatesQuery } from '../query/useAvailableServiceTemplatesQuery';

function CategoryCatalog({ category }: { category: ServiceVo.category }): React.JSX.Element {
    const [selectKey, setSelectKey] = useState<React.Key>('');
    const [expandKeys, setExpandKeys] = useState<React.Key[]>([]);
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [categoryOclData, setCategoryOclData] = useState<Map<string, UserAvailableServiceVo[]>>(
        new Map<string, UserAvailableServiceVo[]>()
    );
    const [unregisteredDisabled, setUnregisteredDisabled] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<React.JSX.Element | undefined>(undefined);

    const availableServicesQuery = useAvailableServiceTemplatesQuery(category);

    useEffect(() => {
        const categoryTreeData: DataNode[] = [];
        const tExpandKeys: React.Key[] = [];
        const userAvailableServiceList: UserAvailableServiceVo[] | undefined = availableServicesQuery.data;
        if (userAvailableServiceList !== undefined && userAvailableServiceList.length > 0) {
            const serviceMapper: Map<string, UserAvailableServiceVo[]> = getServiceMapper(userAvailableServiceList);
            const serviceNameList: string[] = Array.from(serviceMapper.keys());
            setCategoryOclData(serviceMapper);
            serviceNameList.forEach((serviceName: string) => {
                const dataNode: DataNode = {
                    title: serviceName,
                    key: serviceName || '',
                    children: [],
                };
                const versionMapper: Map<string, UserAvailableServiceVo[]> = getVersionMapper(
                    serviceName,
                    userAvailableServiceList
                );
                const versionList: string[] = Array.from(versionMapper.keys());

                versionList.forEach((versionName: string) => {
                    dataNode.children?.push({
                        title: versionName,
                        key: serviceName + '@' + versionName,
                        icon: <TagOutlined />,
                    });
                    tExpandKeys.push(serviceName + '@' + versionName);
                });
                categoryTreeData.push(dataNode);
            });
            setTreeData(categoryTreeData);
            setSelectKey(tExpandKeys[0]);
            setExpandKeys(tExpandKeys);
        } else {
            setTreeData([]);
            setSelectKey('');
            setExpandKeys([]);
            setCategoryOclData(new Map<string, UserAvailableServiceVo[]>());
        }
    }, [availableServicesQuery.data, availableServicesQuery.isSuccess]);

    useEffect(() => {
        if (availableServicesQuery.error instanceof ApiError && 'details' in availableServicesQuery.error.body) {
            const response: Response = availableServicesQuery.error.body as Response;
            setLoadingError(
                <Alert
                    message={response.resultType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={true}
                    className={'catalog-skeleton'}
                />
            );
        } else if (availableServicesQuery.error instanceof Error) {
            setLoadingError(
                <Alert
                    message='Fetching Service Details Failed'
                    description={availableServicesQuery.error.message}
                    type={'error'}
                    closable={true}
                    className={'catalog-skeleton'}
                />
            );
        }
        setTreeData([]);
        setSelectKey('');
        setExpandKeys([]);
        setCategoryOclData(new Map<string, UserAvailableServiceVo[]>());
    }, [availableServicesQuery.error]);

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

    if (availableServicesQuery.isError && loadingError !== undefined) {
        return loadingError;
    }

    if (availableServicesQuery.isLoading || availableServicesQuery.isFetching) {
        return (
            <Skeleton
                className={'catalog-skeleton'}
                active={true}
                loading={true}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    if (availableServicesQuery.isSuccess && availableServicesQuery.data.length === 0) {
        return (
            <div className={'service-blank-class'}>
                <Empty description={'No services available.'} />
            </div>
        );
    }

    return (
        <div className={'catalog-middleware'}>
            <div className={'container'}>
                <div className={'left-class'}>
                    <div className={'left-title-class'}>
                        <HomeOutlined />
                        &nbsp;Service Tree
                    </div>
                    <Tree
                        showIcon={true}
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
                        currentServiceName={selectKey.toString()}
                        confirmUnregister={onConfirmUnregister}
                        category={category}
                    />
                </div>
            </div>
        </div>
    );
}

export default CategoryCatalog;
