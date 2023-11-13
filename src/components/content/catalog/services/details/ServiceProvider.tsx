/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Tabs } from 'antd';
import ServiceDetail from './ServiceDetail';
import {
    ApiError,
    CloudServiceProvider,
    Region,
    Response,
    ServiceVo,
    ServiceTemplateDetailVo,
} from '../../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import { Area } from '../../../order/types/Area';
import UpdateService from '../update/UpdateService';
import UnregisterService from '../unregister/UnregisterService';
import { getCspMapper, getVersionMapper } from '../../../common/catalog/catalogProps';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { cspMap } from '../../../order/types/CspLogo';

let lastServiceName: string = '';

function ServiceProvider({
    categoryOclData,
    currentServiceName,
    confirmUnregister,
    category,
}: {
    categoryOclData: Map<string, ServiceTemplateDetailVo[]>;
    currentServiceName: string;
    confirmUnregister: (disabled: boolean) => void;
    category: ServiceVo.category;
}): React.JSX.Element {
    const [activeKey, setActiveKey] = useState<string>('');
    const [serviceDetails, setServiceDetails] = useState<ServiceTemplateDetailVo | undefined>(undefined);
    const [serviceAreas, setServiceAreas] = useState<Area[]>([]);

    const detailMapper: Map<string, ServiceTemplateDetailVo> = new Map<string, ServiceTemplateDetailVo>();
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    const [name, version] = currentServiceName.split('@');
    const unregisterStatus = useRef<string>('');
    const [unregisterTips, setUnregisterTips] = useState<React.JSX.Element | undefined>(undefined);
    const [unregisterServiceId, setUnregisterServiceId] = useState<string>('');
    const [unregisterTabsItemDisabled, setUnregisterTabsItemDisabled] = useState<boolean>(false);
    const queryClient = useQueryClient();
    function groupRegionsByArea(regions: Region[]): Map<string, Region[]> {
        const map: Map<string, Region[]> = new Map<string, Region[]>();
        regions.forEach((region) => {
            if (region.area && !map.has(region.area)) {
                map.set(
                    region.area,
                    regions.filter((data) => data.area === region.area)
                );
            }
        });
        return map;
    }

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
                            detailMapper.set(key, cspList[0]);
                            const result: Map<string, Region[]> = groupRegionsByArea(cspList[0].regions);
                            const areas: Area[] = [];

                            result.forEach((v, k) => {
                                const regions: string[] = [];

                                v.forEach((region) => {
                                    regions.push(region.name);
                                });
                                const area: Area = { name: k, regions: regions };
                                areas.push(area);
                            });

                            areaMapper.set(key, areas);
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
    function updateServiceDetails(serviceKey: string): void {
        const areas = areaMapper.get(serviceKey);
        const details = detailMapper.get(serviceKey);
        if (details) {
            setServiceDetails(details);
        }
        if (areas) {
            setServiceAreas(areas);
        }
    }
    useEffect(() => {
        if (items.length > 0 && lastServiceName !== currentServiceName) {
            updateServiceDetails(currentServiceName + '@' + items[0].key);
            setActiveKey(items[0]?.key);
        } else if (items.length > 0 && lastServiceName === currentServiceName) {
            setActiveKey(items[0]?.key);
        }
        lastServiceName = currentServiceName;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentServiceName]);

    useEffect(() => {
        updateServiceDetails(currentServiceName + '@' + activeKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey]);

    const onChange = (key: string) => {
        setActiveKey(key);
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
                        {msg instanceof ApiError && 'details' in msg.body ? (
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

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const onConfirmUnregister = async (msg: string | Error, isUnregisterSuccessful: boolean, id: string) => {
        setUnregisterTipsInfo(isUnregisterSuccessful, msg);
        setUnregisterServiceId(id);
        unregisterStatus.current = isUnregisterSuccessful ? 'completed' : 'error';
        confirmUnregister(false);
        setUnregisterTabsItemDisabled(true);
        if (isUnregisterSuccessful) {
            await sleep(5000);
            void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        }
    };

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
    };

    return (
        <>
            {currentServiceName.length > 0 ? (
                <>
                    {serviceDetails !== undefined && unregisterServiceId === serviceDetails.id ? unregisterTips : ''}
                    <Tabs items={items} onChange={onChange} activeKey={activeKey} className={'ant-tabs-tab-btn'} />
                    {serviceDetails !== undefined ? (
                        <>
                            <ServiceDetail serviceDetails={serviceDetails} serviceAreas={serviceAreas} />
                            <div className={'update-unregister-btn-class'}>
                                <UpdateService
                                    id={serviceDetails.id}
                                    unregisterStatus={unregisterStatus}
                                    category={category}
                                />
                                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                                <UnregisterService id={serviceDetails.id} onConfirmHandler={onConfirmUnregister} />
                            </div>
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
