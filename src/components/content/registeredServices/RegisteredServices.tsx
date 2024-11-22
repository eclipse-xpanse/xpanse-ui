/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServerOutlined, GroupOutlined, TagOutlined } from '@ant-design/icons';
import { Alert, Empty, Skeleton } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import servicesEmptyStyles from '../../../styles/services-empty.module.css';
import { ApiError, ErrorResponse, ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList.tsx';
import { isErrorResponse } from '../common/error/isErrorResponse';
import {
    groupRegisteredServicesByVersionForSpecificServiceName,
    groupServicesByCategoryForSpecificNamespace,
    groupServicesByNameForSpecificCategory,
    groupServiceTemplatesByNamespace,
} from '../common/registeredServices/registeredServiceProps.ts';
import useListAllServiceTemplatesQuery from '../review/query/useListAllServiceTemplatesQuery.ts';
import { RegisteredServicesFullView } from './tree/RegisteredServicesFullView.tsx';

export default function RegisteredServices(): React.JSX.Element {
    const treeData: DataNode[] = [];
    let availableServiceList: ServiceTemplateDetailVo[] = [];

    const availableServiceTemplatesQuery = useListAllServiceTemplatesQuery();

    if (availableServiceTemplatesQuery.isSuccess && availableServiceTemplatesQuery.data.length > 0) {
        availableServiceList = availableServiceTemplatesQuery.data;
        const availableServicesData: Map<string, ServiceTemplateDetailVo[]> =
            groupServiceTemplatesByNamespace(availableServiceList);

        availableServicesData.forEach((_value: ServiceTemplateDetailVo[], namespace: string) => {
            const dataNode: DataNode = {
                title: <div className={catalogStyles.catalogTreeNode}>{namespace}</div>,
                key: namespace || '',
                children: [],
            };

            const categoryServiceMapper = groupServicesByCategoryForSpecificNamespace(namespace, availableServiceList);
            categoryServiceMapper.forEach((_value: ServiceTemplateDetailVo[], category: string) => {
                const categoryNode: DataNode = {
                    title: category,
                    key: `${namespace}@${category}`,
                    icon: <GroupOutlined />,
                    children: [],
                };

                const serviceMapper = groupServicesByNameForSpecificCategory(namespace, category, availableServiceList);
                serviceMapper.forEach((_value: ServiceTemplateDetailVo[], serviceName: string) => {
                    const serviceNode: DataNode = {
                        title: serviceName,
                        key: `${namespace}@${category}@${serviceName}`,
                        icon: <CloudServerOutlined />,
                        children: [],
                    };

                    const versionMapper = groupRegisteredServicesByVersionForSpecificServiceName(
                        namespace,
                        category,
                        serviceName,
                        availableServiceList
                    );
                    versionMapper.forEach((_value: ServiceTemplateDetailVo[], version: string) => {
                        const versionNode: DataNode = {
                            title: version,
                            key: `${namespace}@${category}@${serviceName}@${version}`,
                            icon: <TagOutlined />,
                            children: [],
                        };

                        serviceNode.children?.push(versionNode);
                    });

                    categoryNode.children?.push(serviceNode);
                });

                dataNode.children?.push(categoryNode);
            });

            treeData.push(dataNode);
        });
    }

    if (availableServiceTemplatesQuery.isError) {
        if (
            availableServiceTemplatesQuery.error instanceof ApiError &&
            availableServiceTemplatesQuery.error.body &&
            isErrorResponse(availableServiceTemplatesQuery.error.body)
        ) {
            const response: ErrorResponse = availableServiceTemplatesQuery.error.body;
            return (
                <Alert
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={true}
                    className={catalogStyles.catalogSkeleton}
                />
            );
        } else {
            return (
                <Alert
                    message='Fetching Service Details Failed'
                    description={availableServiceTemplatesQuery.error.message}
                    type={'error'}
                    closable={true}
                    className={catalogStyles.catalogSkeleton}
                />
            );
        }
    }

    if (availableServiceTemplatesQuery.isLoading || availableServiceTemplatesQuery.isFetching) {
        return (
            <Skeleton
                className={catalogStyles.catalogSkeleton}
                active={true}
                loading={true}
                paragraph={{ rows: 2, width: ['20%', '20%'] }}
                title={{ width: '5%' }}
            />
        );
    }

    if (availableServiceTemplatesQuery.data && availableServiceTemplatesQuery.data.length === 0) {
        return (
            <div className={servicesEmptyStyles.serviceBlankClass}>
                <Empty description={'No services available.'} />
            </div>
        );
    }

    return (
        <div className={catalogStyles.catalogMiddleware}>
            <div className={catalogStyles.container}>
                <RegisteredServicesFullView treeData={treeData} availableServiceList={availableServiceList} />
            </div>
        </div>
    );
}
