/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServerOutlined, GroupOutlined, TagOutlined } from '@ant-design/icons';
import { Empty, Skeleton } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';
import catalogStyles from '../../../styles/catalog.module.css';
import servicesEmptyStyles from '../../../styles/services-empty.module.css';
import { ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { serviceDetailsErrorText } from '../../utils/constants.tsx';
import RetryPrompt from '../common/error/RetryPrompt.tsx';
import {
    groupRegisteredServicesByVersionForSpecificServiceName,
    groupServicesByCategoryForSpecificServiceVendor,
    groupServicesByNameForSpecificCategory,
    groupServiceTemplatesByServiceVendor,
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
            groupServiceTemplatesByServiceVendor(availableServiceList);

        availableServicesData.forEach((_value: ServiceTemplateDetailVo[], serviceVendor: string) => {
            const dataNode: DataNode = {
                title: <div className={catalogStyles.catalogTreeNode}>{serviceVendor}</div>,
                key: serviceVendor || '',
                children: [],
            };

            const categoryServiceMapper = groupServicesByCategoryForSpecificServiceVendor(
                serviceVendor,
                availableServiceList
            );
            categoryServiceMapper.forEach((_value: ServiceTemplateDetailVo[], category: string) => {
                const categoryNode: DataNode = {
                    title: category,
                    key: `${serviceVendor}@${category}`,
                    icon: <GroupOutlined />,
                    children: [],
                };

                const serviceMapper = groupServicesByNameForSpecificCategory(
                    serviceVendor,
                    category,
                    availableServiceList
                );
                serviceMapper.forEach((_value: ServiceTemplateDetailVo[], serviceName: string) => {
                    const serviceNode: DataNode = {
                        title: serviceName,
                        key: `${serviceVendor}@${category}@${serviceName}`,
                        icon: <CloudServerOutlined />,
                        children: [],
                    };

                    const versionMapper = groupRegisteredServicesByVersionForSpecificServiceName(
                        serviceVendor,
                        category,
                        serviceName,
                        availableServiceList
                    );
                    versionMapper.forEach((_value: ServiceTemplateDetailVo[], version: string) => {
                        const versionNode: DataNode = {
                            title: version,
                            key: `${serviceVendor}@${category}@${serviceName}@${version}`,
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
        return (
            <RetryPrompt
                error={availableServiceTemplatesQuery.error}
                retryRequest={() => {
                    void availableServiceTemplatesQuery.refetch();
                }}
                errorMessage={serviceDetailsErrorText}
            />
        );
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
