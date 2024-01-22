/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Alert, Divider, Image, Tabs } from 'antd';
import ServiceDetail from './ServiceDetail';
import {
    ApiError,
    CloudServiceProvider,
    DeployedService,
    Response,
    ServiceTemplateDetailVo,
} from '../../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import UpdateService from '../update/UpdateService';
import UnregisterService from '../unregister/UnregisterService';
import { getCspMapper, getVersionMapper } from '../../../common/catalog/catalogProps';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { cspMap } from '../../../common/csp/CspLogo';
import { ServiceHostingOptions } from './ServiceHostingOptions';
import { useSearchParams } from 'react-router-dom';
import { serviceCspQuery, serviceHostingTypeQuery } from '../../../../utils/constants';
import { ServicePolicies } from '../policies/ServicePolicies';
import { EnvironmentOutlined } from '@ant-design/icons';

function ServiceProvider({
    categoryOclData,
    currentServiceName,
    confirmUnregister,
    category,
    getCsp,
    getHostType,
}: {
    categoryOclData: Map<string, ServiceTemplateDetailVo[]>;
    currentServiceName: string;
    confirmUnregister: (disabled: boolean) => void;
    category: DeployedService.category;
    getCsp: (arg: string) => void;
    getHostType: (arg: string) => void;
}): React.JSX.Element {
    const [urlParams] = useSearchParams();
    const serviceCspInQuery = getServiceCspFormQuery();
    const serviceHostingTypeInQuery = getServiceHostingTypeFormQuery();
    const [activeKey, setActiveKey] = useState<string>('');
    const [serviceDetails, setServiceDetails] = useState<ServiceTemplateDetailVo[] | undefined>(undefined);
    const [activeServiceDetail, setActiveServiceDetail] = useState<ServiceTemplateDetailVo | undefined>(undefined);

    const detailMapper: MutableRefObject<Map<string, ServiceTemplateDetailVo[]>> = useRef(
        new Map<string, ServiceTemplateDetailVo[]>()
    );
    const [name, version] = currentServiceName.split('@');
    const unregisterStatus = useRef<string>('');
    const [unregisterTips, setUnregisterTips] = useState<React.JSX.Element | undefined>(undefined);
    const [unregisterServiceId, setUnregisterServiceId] = useState<string>('');
    const [unregisterTabsItemDisabled, setUnregisterTabsItemDisabled] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const getCspTabs = (categoryOclData: Map<string, ServiceTemplateDetailVo[]>): Tab[] => {
        const items: Tab[] = [];
        categoryOclData.forEach((serviceList, serviceName) => {
            if (serviceName === name) {
                const versionMapper = getVersionMapper(serviceName, serviceList);
                versionMapper.forEach((versionList, versionName) => {
                    if (versionName === version) {
                        const cspMapper = getCspMapper(serviceName, versionName, versionList);
                        cspMapper.forEach((cspList, cspName) => {
                            const key = currentServiceName + '@' + cspName;
                            detailMapper.current.set(key, cspList);
                            const name = cspName.toString();
                            const item: Tab = {
                                label: (
                                    <div>
                                        <Image
                                            width={120}
                                            preview={false}
                                            src={cspMap.get(cspName as CloudServiceProvider.name)?.logo}
                                        />
                                    </div>
                                ),
                                key: name,
                                children: [],
                                disabled: unregisterTabsItemDisabled,
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

    function getServiceCspFormQuery(): string {
        const queryInUri = decodeURI(urlParams.get(serviceCspQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }

    function getServiceHostingTypeFormQuery(): string {
        const queryInUri = decodeURI(urlParams.get(serviceHostingTypeQuery) ?? '');
        if (queryInUri.length > 0) {
            return queryInUri;
        }
        return '';
    }

    useEffect(() => {
        setActiveKey(serviceCspInQuery);
        const details = detailMapper.current.get(currentServiceName + '@' + serviceCspInQuery);
        if (details) {
            let isActiveDetailUpdated = false;
            setServiceDetails(details);
            if (serviceHostingTypeInQuery) {
                for (const serviceTemplateDetailVo of details) {
                    if (serviceTemplateDetailVo.serviceHostingType.toString() === serviceHostingTypeInQuery) {
                        setActiveServiceDetail(serviceTemplateDetailVo);
                        isActiveDetailUpdated = true;
                    }
                }
            }
            if (!isActiveDetailUpdated) {
                setActiveServiceDetail(details[0]);
                getHostType(details[0].serviceHostingType);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceHostingTypeInQuery, serviceCspInQuery, categoryOclData]);

    const onChange = (key: string) => {
        getCsp(key);
    };

    const onChangeServiceHostingType = (serviceTemplateDetailVo: ServiceTemplateDetailVo) => {
        getHostType(serviceTemplateDetailVo.serviceHostingType);
    };

    function setUnregisterTipsInfo(unregisterResult: boolean, msg: string | Error) {
        setUnregisterTips(
            <div className={'submit-alert-tip'}>
                {' '}
                {unregisterResult ? (
                    <Alert
                        message='Unregister:'
                        description={msg as string}
                        showIcon
                        type={'success'}
                        closable={true}
                        onClose={onRemove}
                    />
                ) : (
                    <div>
                        {msg instanceof ApiError && msg.body && 'details' in msg.body ? (
                            <Alert
                                message='Unregister:'
                                description={(msg.body as Response).details}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        ) : (
                            <Alert
                                message='Unregister:'
                                description={(msg as Error).message}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        )}
                    </div>
                )}{' '}
            </div>
        );
    }

    const onConfirmUnregister = (msg: string | Error, isUnregisterSuccessful: boolean, id: string) => {
        setUnregisterTipsInfo(isUnregisterSuccessful, msg);
        setUnregisterServiceId(id);
        unregisterStatus.current = isUnregisterSuccessful ? 'completed' : 'error';
        confirmUnregister(false);
        setUnregisterTabsItemDisabled(true);
        if (isUnregisterSuccessful) {
            void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        }
    };

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
    };

    return (
        <>
            {serviceDetails && unregisterServiceId === serviceDetails[0].id ? unregisterTips : ''}
            {currentServiceName.length > 0 ? (
                <>
                    {serviceDetails && activeServiceDetail ? (
                        <>
                            <Tabs
                                items={items}
                                onChange={onChange}
                                activeKey={activeKey}
                                className={'ant-tabs-tab-btn'}
                            />
                            <div className={'update-unregister-btn-class'}>
                                <UpdateService
                                    id={activeServiceDetail.id}
                                    unregisterStatus={unregisterStatus}
                                    category={category}
                                />
                                <UnregisterService id={activeServiceDetail.id} onConfirmHandler={onConfirmUnregister} />
                            </div>
                            <h3 className={'catalog-details-h3'}>
                                <EnvironmentOutlined />
                                &nbsp;Service Hosting Options
                            </h3>
                            <ServiceHostingOptions
                                serviceTemplateDetailVos={serviceDetails}
                                defaultDisplayedService={activeServiceDetail}
                                serviceHostingTypeInQuery={serviceHostingTypeInQuery}
                                updateServiceHostingType={onChangeServiceHostingType}
                            />
                            <ServiceDetail serviceDetails={activeServiceDetail} />

                            <Divider />
                            <ServicePolicies serviceTemplateId={activeServiceDetail.id} />
                        </>
                    ) : null}
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default ServiceProvider;
