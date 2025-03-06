/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { TagOutlined } from '@ant-design/icons';
import { Empty, Skeleton } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useMemo, useState } from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import servicesEmptyStyles from '../../../../../styles/services-empty.module.css';
import { category, ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { serviceDetailsErrorText } from '../../../../utils/constants.tsx';
import {
    groupServicesByVersionForSpecificServiceName,
    groupServiceTemplatesByName,
} from '../../../common/catalog/catalogProps';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import { useAvailableServiceTemplatesQuery } from '../query/useAvailableServiceTemplatesQuery';
import { CatalogFullView } from './CatalogFullView';

function CategoryCatalog({ category }: { category: category }): React.JSX.Element {
    const availableServiceTemplatesQuery = useAvailableServiceTemplatesQuery(category);

    const [isShowUnpublishAlert, setIsShowUnpublishAlert] = useState(false);
    const [isShowRepublishAlert, setIsShowRepublishAlert] = useState(false);
    const [isShowCancelRequestAlert, setIsShowCancelRequestAlert] = useState(false);

    // Process data conditionally, but don't return yet
    const categoryOclData: Map<string, ServiceTemplateDetailVo[]> = useMemo(() => {
        let categoryOclData: Map<string, ServiceTemplateDetailVo[]> = new Map<string, ServiceTemplateDetailVo[]>();
        if (availableServiceTemplatesQuery.isSuccess && availableServiceTemplatesQuery.data.length > 0) {
            const userAvailableServiceList: ServiceTemplateDetailVo[] = availableServiceTemplatesQuery.data;
            categoryOclData = groupServiceTemplatesByName(userAvailableServiceList);
        }
        return categoryOclData;
    }, [availableServiceTemplatesQuery]);

    const treeData: DataNode[] = useMemo(() => {
        const treeData: DataNode[] = [];
        categoryOclData.forEach((_value: ServiceTemplateDetailVo[], serviceName: string) => {
            const dataNode: DataNode = {
                title: <div className={catalogStyles.catalogTreeNode}>{serviceName}</div>,
                key: serviceName || '',
                children: [],
            };
            const versionMapper: Map<string, ServiceTemplateDetailVo[]> = groupServicesByVersionForSpecificServiceName(
                serviceName,
                availableServiceTemplatesQuery.data ?? []
            );
            versionMapper.forEach((_value: ServiceTemplateDetailVo[], versionName: string) => {
                dataNode.children?.push({
                    title: versionName,
                    key: serviceName + '@' + versionName,
                    icon: <TagOutlined />,
                });
            });
            treeData.push(dataNode);
        });
        return treeData;
    }, [availableServiceTemplatesQuery, categoryOclData]);

    // Handle errors
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

    // Handle loading state
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

    // Handle empty state
    if (availableServiceTemplatesQuery.data && availableServiceTemplatesQuery.data.length === 0) {
        return (
            <div className={servicesEmptyStyles.serviceBlankClass}>
                <Empty description={'No services available.'} />
            </div>
        );
    }

    // Main return
    return (
        <div className={catalogStyles.catalogMiddleware}>
            <div className={catalogStyles.container}>
                <CatalogFullView
                    treeData={treeData}
                    categoryOclData={categoryOclData}
                    category={category}
                    isShowUnpublishAlert={isShowUnpublishAlert}
                    setIsShowUnpublishAlert={setIsShowUnpublishAlert}
                    isShowRepublishAlert={isShowRepublishAlert}
                    setIsShowRepublishAlert={setIsShowRepublishAlert}
                    isShowCancelRequestAlert={isShowCancelRequestAlert}
                    setIsShowCancelRequestAlert={setIsShowCancelRequestAlert}
                />
            </div>
        </div>
    );
}

export default CategoryCatalog;
