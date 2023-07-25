/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import '../../../styles/catalog.css';
import { DataNode } from 'antd/es/tree';
import ServiceProvider from './services/ServiceProvider';
import { HomeOutlined } from '@ant-design/icons';
import {
    ApiError,
    CategoryOclVo,
    Response,
    ServicesAvailableService,
    ServiceVo,
    VersionOclVo,
} from '../../../xpanse-api/generated';
import { Alert, Empty, Skeleton, Tree } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList';

function CategoryCatalog({ category }: { category: ServiceVo.category }): JSX.Element {
    const [selectKey, setSelectKey] = useState<React.Key>('');
    const [expandKeys, setExpandKeys] = useState<React.Key[]>([]);
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [categoryOclData, setCategoryOclData] = useState<CategoryOclVo[]>([]);
    const [unregisteredDisabled, setUnregisteredDisabled] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<JSX.Element | undefined>(undefined);

    const availableServicesQuery = useQuery({
        queryKey: ['catalog', category],
        queryFn: () => ServicesAvailableService.getAvailableServicesTree(category),
        staleTime: 60000,
    });

    useEffect(() => {
        const tData: DataNode[] = [];
        const tExpandKeys: React.Key[] = [];
        const services: CategoryOclVo[] | undefined = availableServicesQuery.data;
        if (services !== undefined && services.length > 0) {
            setCategoryOclData(services);
            services.forEach((service) => {
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
            setSelectKey(services[0].name + '@' + services[0].versions[0].version);
            setExpandKeys(tExpandKeys);
        } else {
            setTreeData([]);
            setSelectKey('');
            setExpandKeys([]);
            setCategoryOclData([]);
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
        setCategoryOclData([]);
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

    if (availableServicesQuery.isLoading) {
        return (
            <Skeleton
                className={'catalog-skeleton'}
                active={true}
                loading={availableServicesQuery.isLoading}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

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

export default CategoryCatalog;
