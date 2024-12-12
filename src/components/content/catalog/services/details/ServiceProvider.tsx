/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Badge, Empty, Image, Tabs } from 'antd';
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
import { useReRegisterRequest } from '../re-register/ReRegisterMutation';
import { ReRegisterResult } from '../re-register/ReRegisterResult';
import ReRegisterService from '../re-register/ReRegisterService';
import { UnregisterResult } from '../unregister/UnregisterResult';
import UnregisterService from '../unregister/UnregisterService';
import UpdateService from '../update/UpdateService';
import { ServiceProviderSkeleton } from './ServiceProviderSkeleton';
import ServiceTemplateDetails from './ServiceTemplateDetails';

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
                                    activeServiceDetail={activeServiceDetail}
                                />
                                <UnregisterService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    availableInCatalog={activeServiceDetail.availableInCatalog}
                                />
                                <ReRegisterService
                                    setIsViewDisabled={setIsViewDisabled}
                                    reRegisterRequest={reRegisterRequest}
                                    activeServiceDetail={activeServiceDetail}
                                />
                                <DeleteService
                                    id={activeServiceDetail.serviceTemplateId}
                                    setIsViewDisabled={setIsViewDisabled}
                                    activeServiceDetail={activeServiceDetail}
                                />
                            </div>
                            {(activeServiceDetail.serviceTemplateRegistrationState === 'in-review' ||
                                activeServiceDetail.serviceTemplateRegistrationState === 'approved') &&
                            !activeServiceDetail.availableInCatalog ? (
                                <Badge.Ribbon
                                    placement={'start'}
                                    text={<div className={catalogStyles.serviceTemplateState}>Review In-Progress</div>}
                                    color='#e67300'
                                >
                                    <ServiceTemplateDetails
                                        isViewDisabled={isViewDisabled}
                                        serviceDetails={activeServiceDetail}
                                        groupServiceTemplatesByCsp={groupServiceTemplatesByCsp}
                                        serviceCspInQuery={serviceCspInQuery}
                                        serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                        onChangeServiceHostingType={onChangeServiceHostingType}
                                    />
                                </Badge.Ribbon>
                            ) : activeServiceDetail.serviceTemplateRegistrationState === 'approved' &&
                              activeServiceDetail.availableInCatalog ? (
                                <Badge.Ribbon
                                    placement={'start'}
                                    text={<div>Available In Catalog</div>}
                                    color='#87d068'
                                >
                                    <ServiceTemplateDetails
                                        isViewDisabled={isViewDisabled}
                                        serviceDetails={activeServiceDetail}
                                        groupServiceTemplatesByCsp={groupServiceTemplatesByCsp}
                                        serviceCspInQuery={serviceCspInQuery}
                                        serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                        onChangeServiceHostingType={onChangeServiceHostingType}
                                    />
                                </Badge.Ribbon>
                            ) : activeServiceDetail.isUpdatePending && activeServiceDetail.availableInCatalog ? (
                                <Badge.Ribbon
                                    placement={'start'}
                                    text={
                                        <div className={catalogStyles.serviceTemplateState}>
                                            Available in catalog <br />
                                            Updated template review in progress.
                                        </div>
                                    }
                                    color='#e67300'
                                >
                                    <ServiceTemplateDetails
                                        isViewDisabled={isViewDisabled}
                                        serviceDetails={activeServiceDetail}
                                        groupServiceTemplatesByCsp={groupServiceTemplatesByCsp}
                                        serviceCspInQuery={serviceCspInQuery}
                                        serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                        onChangeServiceHostingType={onChangeServiceHostingType}
                                    />
                                </Badge.Ribbon>
                            ) : activeServiceDetail.serviceTemplateRegistrationState === 'approved' &&
                              !activeServiceDetail.availableInCatalog &&
                              !activeServiceDetail.isUpdatePending ? (
                                <Badge.Ribbon
                                    placement={'start'}
                                    text={<div>Not Available in Catalog</div>}
                                    color='#cd201f'
                                >
                                    <ServiceTemplateDetails
                                        isViewDisabled={isViewDisabled}
                                        serviceDetails={activeServiceDetail}
                                        groupServiceTemplatesByCsp={groupServiceTemplatesByCsp}
                                        serviceCspInQuery={serviceCspInQuery}
                                        serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                        onChangeServiceHostingType={onChangeServiceHostingType}
                                    />
                                </Badge.Ribbon>
                            ) : activeServiceDetail.serviceTemplateRegistrationState === 'rejected' &&
                              !activeServiceDetail.availableInCatalog &&
                              activeServiceDetail.isUpdatePending ? (
                                <Badge.Ribbon
                                    placement={'start'}
                                    text={<div className={catalogStyles.serviceTemplateState}>Review In-Progress</div>}
                                    color='#e67300'
                                >
                                    <ServiceTemplateDetails
                                        isViewDisabled={isViewDisabled}
                                        serviceDetails={activeServiceDetail}
                                        groupServiceTemplatesByCsp={groupServiceTemplatesByCsp}
                                        serviceCspInQuery={serviceCspInQuery}
                                        serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                        onChangeServiceHostingType={onChangeServiceHostingType}
                                    />
                                </Badge.Ribbon>
                            ) : activeServiceDetail.serviceTemplateRegistrationState === 'approved' &&
                              activeServiceDetail.availableInCatalog &&
                              activeServiceDetail.isUpdatePending ? (
                                <Badge.Ribbon
                                    placement={'start'}
                                    text={<div>Available In Catalog</div>}
                                    color='#87d068'
                                >
                                    <ServiceTemplateDetails
                                        isViewDisabled={isViewDisabled}
                                        serviceDetails={activeServiceDetail}
                                        groupServiceTemplatesByCsp={groupServiceTemplatesByCsp}
                                        serviceCspInQuery={serviceCspInQuery}
                                        serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                        onChangeServiceHostingType={onChangeServiceHostingType}
                                    />
                                </Badge.Ribbon>
                            ) : null}
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
