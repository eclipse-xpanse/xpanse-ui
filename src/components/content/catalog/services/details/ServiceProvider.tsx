/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { EnvironmentOutlined } from '@ant-design/icons';
import { Empty, Image, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import React, { useMemo } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import catalogStyles from '../../../../../styles/catalog.module.css';
import {
    category,
    name,
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
} from '../../../../../xpanse-api/generated';
import {
    catalogPageRoute,
    serviceCspQuery,
    serviceHostingTypeQuery,
    serviceNameKeyQuery,
    serviceVersionKeyQuery,
} from '../../../../utils/constants';
import {
    groupServicesByCspForSpecificServiceNameAndVersion,
    groupServicesByVersionForSpecificServiceName,
} from '../../../common/catalog/catalogProps';
import { cspMap } from '../../../common/csp/CspLogo';
import { DeleteResult } from '../delete/DeleteResult';
import DeleteService from '../delete/DeleteService';
import { ServicePolicies } from '../policies/ServicePolicies';
import { useRepublishRequest } from '../republish/RepublishMutation.ts';
import { RepublishResult } from '../republish/RepublishResult.tsx';
import RepublishService from '../republish/RepublishService.tsx';
import { UnpublishResult } from '../unpublish/UnpublishResult.tsx';
import UnpublishService from '../unpublish/UnpublishService.tsx';
import UpdateService from '../update/UpdateService';
import ServiceDetail from './ServiceDetail';
import { ServiceHostingOptions } from './ServiceHostingOptions';
import { ServiceProviderSkeleton } from './ServiceProviderSkeleton';

function ServiceProvider({
    categoryOclData,
    selectedServiceNameInTree,
    selectedServiceVersionInTree,
    category,
    isViewDisabled,
    setIsViewDisabled,
}: {
    categoryOclData: Map<string, ServiceTemplateDetailVo[]>;
    selectedServiceNameInTree: string;
    selectedServiceVersionInTree: string;
    category: category;
    isViewDisabled: boolean;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
}): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const navigate = useNavigate();
    const serviceCspInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceCspQuery) ?? '');
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

    const serviceVersionInQuery = useMemo(() => {
        const queryInUri = decodeURI(urlParams.get(serviceVersionKeyQuery) ?? '');
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

    let activeServiceDetail: ServiceTemplateDetailVo | undefined = undefined;

    const groupServiceTemplatesByCsp: Map<string, ServiceTemplateDetailVo[]> = new Map<
        string,
        ServiceTemplateDetailVo[]
    >();

    const getCspTabs = (categoryOclData: Map<string, ServiceTemplateDetailVo[]>): Tab[] => {
        const items: Tab[] = [];
        categoryOclData.forEach((serviceList, serviceName) => {
            if (serviceName === selectedServiceNameInTree) {
                const versionsToServiceTemplatesMap = groupServicesByVersionForSpecificServiceName(
                    serviceName,
                    serviceList
                );
                versionsToServiceTemplatesMap.forEach((versionList, versionName) => {
                    if (versionName === selectedServiceVersionInTree) {
                        const cspToServiceTemplatesMap = groupServicesByCspForSpecificServiceNameAndVersion(
                            serviceName,
                            versionName,
                            versionList
                        );
                        cspToServiceTemplatesMap.forEach((serviceTemplates, cspName) => {
                            groupServiceTemplatesByCsp.set(cspName, serviceTemplates);
                            const item: Tab = {
                                label: (
                                    <div>
                                        <Image width={120} preview={false} src={cspMap.get(cspName as name)?.logo} />
                                    </div>
                                ),
                                key: cspName.toString(),
                                children: [],
                                disabled: isViewDisabled,
                            };
                            items.push(item);
                        });
                    }
                });
            }
        });
        return items;
    };

    const items: Tab[] = getCspTabs(categoryOclData);

    if (serviceNameInQuery) {
        const serviceTemplates = categoryOclData.get(serviceNameInQuery);
        if (serviceTemplates) {
            for (const value of serviceTemplates) {
                if (
                    value.version === serviceVersionInQuery &&
                    value.serviceHostingType.toString() === serviceHostingTypeInQuery &&
                    value.csp.toString() === serviceCspInQuery
                ) {
                    activeServiceDetail = value;
                }
            }
        }
    }

    const republishRequest = useRepublishRequest(activeServiceDetail?.serviceTemplateId ?? '');

    const onChangeCsp = (key: string) => {
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
            search: createSearchParams({
                csp: key,
                serviceName: selectedServiceNameInTree,
                version: selectedServiceVersionInTree,
                hostingType: groupServiceTemplatesByCsp.get(key)?.[0].serviceHostingType ?? '',
            }).toString(),
        });
    };

    const onChangeServiceHostingType = (serviceTemplateDetailVo: ServiceTemplateDetailVo) => {
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
            search: createSearchParams({
                csp: serviceCspInQuery,
                serviceName: selectedServiceNameInTree,
                version: selectedServiceVersionInTree,
                hostingType: serviceTemplateDetailVo.serviceHostingType.toString(),
            }).toString(),
        });
    };

    // this component renders even before the values are set in the URL. We must wait until it is done.
    if (!serviceCspInQuery && !serviceVersionInQuery && !serviceHostingTypeInQuery && !serviceNameInQuery) {
        return <ServiceProviderSkeleton />;
    }

    return (
        <>
            {selectedServiceNameInTree.length > 0 ? (
                <>
                    {activeServiceDetail ? (
                        <>
                            <UnpublishResult id={activeServiceDetail.serviceTemplateId} category={category} />
                            <RepublishResult id={activeServiceDetail.serviceTemplateId} category={category} />
                            <DeleteResult id={activeServiceDetail.serviceTemplateId} category={category} />
                            <Tabs
                                items={items}
                                onChange={onChangeCsp}
                                activeKey={serviceCspInQuery}
                                className={catalogStyles.antTabsTabBtn}
                            />
                            <div className={catalogStyles.updateUnpublishBtnClass}>
                                <UpdateService
                                    id={activeServiceDetail.serviceTemplateId}
                                    category={category}
                                    isViewDisabled={isViewDisabled}
                                    registrationState={
                                        activeServiceDetail.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                    }
                                    isReviewInProgress={activeServiceDetail.isReviewInProgress}
                                />
                                <UnpublishService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    serviceRegistrationStatus={
                                        activeServiceDetail.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                    }
                                    isAvailableInCatalog={activeServiceDetail.isAvailableInCatalog}
                                />
                                <RepublishService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    republishRequest={republishRequest}
                                    serviceRegistrationStatus={
                                        activeServiceDetail.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                    }
                                    isReviewInProgress={activeServiceDetail.isReviewInProgress}
                                    isAvailableInCatalog={activeServiceDetail.isAvailableInCatalog}
                                />
                                <DeleteService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    isAvailableInCatalog={activeServiceDetail.isAvailableInCatalog}
                                />
                            </div>
                            <h3 className={catalogStyles.catalogDetailsH3}>
                                <EnvironmentOutlined />
                                &nbsp;Service Hosting Options
                            </h3>
                            <ServiceHostingOptions
                                serviceTemplateDetailVos={groupServiceTemplatesByCsp.get(serviceCspInQuery) ?? []}
                                defaultDisplayedService={activeServiceDetail}
                                serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                updateServiceHostingType={onChangeServiceHostingType}
                            />
                            <ServiceDetail serviceDetails={activeServiceDetail} />
                            <ServicePolicies
                                key={activeServiceDetail.serviceTemplateId}
                                serviceDetails={activeServiceDetail}
                                isViewDisabled={isViewDisabled}
                            />
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

export default ServiceProvider;
