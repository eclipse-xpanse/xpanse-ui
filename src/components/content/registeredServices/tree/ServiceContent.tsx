/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { EnvironmentOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import React, { useMemo } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import catalogStyles from '../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../xpanse-api/generated';
import {
    registeredServicesPageRoute,
    serviceCategoryQuery,
    serviceHostingTypeQuery,
    serviceNameKeyQuery,
    serviceNamespaceQuery,
    serviceVersionKeyQuery,
} from '../../../utils/constants.tsx';
import ServiceDetail from '../../catalog/services/details/ServiceDetail.tsx';
import { ServiceHostingOptions } from '../../catalog/services/details/ServiceHostingOptions.tsx';
import { ServiceProviderSkeleton } from '../../catalog/services/details/ServiceProviderSkeleton.tsx';

function ServiceContent({
    availableServiceList,
    selectedServiceNamespaceInTree,
    selectedServiceCategoryInTree,
    selectedServiceNameInTree,
    selectedServiceVersionInTree,
}: {
    availableServiceList: ServiceTemplateDetailVo[];
    selectedServiceNamespaceInTree: string;
    selectedServiceCategoryInTree: string;
    selectedServiceNameInTree: string;
    selectedServiceVersionInTree: string;
}): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const navigate = useNavigate();

    const serviceNamespaceInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceNamespaceQuery) ?? '');
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

    const serviceHostingTypeInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceHostingTypeQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }, [urlParams]);

    let activeServiceDetail: ServiceTemplateDetailVo | undefined = undefined;

    if (serviceNameInQuery) {
        if (availableServiceList.length > 0) {
            for (const value of availableServiceList) {
                if (
                    value.category.toString() === serviceCategoryInQuery &&
                    value.name === serviceNameInQuery &&
                    value.version === serviceVersionInQuery &&
                    value.serviceHostingType.toString() === serviceHostingTypeInQuery
                ) {
                    activeServiceDetail = value;
                }
            }
        }
    }

    const onChangeServiceHostingType = (serviceTemplateDetailVo: ServiceTemplateDetailVo) => {
        void navigate({
            pathname: registeredServicesPageRoute,
            search: createSearchParams({
                namespace: selectedServiceNamespaceInTree,
                category: selectedServiceCategoryInTree,
                serviceName: selectedServiceNameInTree,
                version: selectedServiceVersionInTree,
                hostingType: serviceTemplateDetailVo.serviceHostingType.toString(),
            }).toString(),
        });
    };

    // this component renders even before the values are set in the URL. We must wait until it is done.
    if (
        !serviceNamespaceInQuery &&
        !serviceCategoryInQuery &&
        !serviceNameInQuery &&
        !serviceVersionInQuery &&
        !serviceHostingTypeInQuery
    ) {
        return <ServiceProviderSkeleton />;
    }

    return (
        <>
            {selectedServiceNameInTree.length > 0 ? (
                <>
                    {activeServiceDetail ? (
                        <>
                            <h3 className={catalogStyles.catalogDetailsH3}>
                                <EnvironmentOutlined />
                                &nbsp;Service Hosting Options
                            </h3>
                            <ServiceHostingOptions
                                serviceTemplateDetailVos={[activeServiceDetail]}
                                defaultDisplayedService={activeServiceDetail}
                                serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                updateServiceHostingType={onChangeServiceHostingType}
                            />
                            <ServiceDetail serviceDetails={activeServiceDetail} />
                        </>
                    ) : (
                        // Necessary when user manually enters wrong details in the URL query parameters.
                        <Empty description={'No services available for the provided query parameters in the url.'} />
                    )}
                </>
            ) : (
                <Empty description={'No services available.'} />
            )}
        </>
    );
}

export default ServiceContent;
