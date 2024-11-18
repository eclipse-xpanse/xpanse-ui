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
    ServiceTemplateDetailVo,
    category,
    name,
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
import { useReRegisterRequest } from '../re-register/ReRegisterMutation';
import { ReRegisterResult } from '../re-register/ReRegisterResult';
import ReRegisterService from '../re-register/ReRegisterService';
import { UnregisterResult } from '../unregister/UnregisterResult';
import UnregisterService from '../unregister/UnregisterService';
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

    const reRegisterRequest = useReRegisterRequest(activeServiceDetail?.serviceTemplateId ?? '');

    const onChangeCsp = (key: string) => {
        navigate({
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
        navigate({
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
                            <UnregisterResult id={activeServiceDetail.serviceTemplateId} category={category} />
                            <ReRegisterResult
                                id={activeServiceDetail.serviceTemplateId}
                                serviceRegistrationStatus={
                                    reRegisterRequest.data
                                        ?.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                }
                                category={category}
                            />
                            <DeleteResult id={activeServiceDetail.serviceTemplateId} category={category} />
                            <Tabs
                                items={items}
                                onChange={onChangeCsp}
                                activeKey={serviceCspInQuery}
                                className={catalogStyles.antTabsTabBtn}
                            />
                            <div className={catalogStyles.updateUnregisterBtnClass}>
                                <UpdateService
                                    id={activeServiceDetail.serviceTemplateId}
                                    category={category}
                                    isViewDisabled={isViewDisabled}
                                />
                                <UnregisterService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    serviceRegistrationStatus={
                                        activeServiceDetail.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                    }
                                />
                                <ReRegisterService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    reRegisterRequest={reRegisterRequest}
                                    serviceRegistrationStatus={
                                        activeServiceDetail.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                    }
                                />
                                <DeleteService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    serviceRegistrationStatus={
                                        activeServiceDetail.serviceTemplateRegistrationState as serviceTemplateRegistrationState
                                    }
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
