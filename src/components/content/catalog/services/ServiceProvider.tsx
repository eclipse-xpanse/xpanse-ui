/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Tabs } from 'antd';
import ServiceDetail from './ServiceDetail';
import { CategoryOclVo, ProviderOclVo, Region, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import { Area } from '../../../utils/Area';
import UpdateService from './UpdateService';
import UnregisterService from './UnregisterService';
import { cspMap } from '../../order/formElements/CspSelect';

let lastServiceName: string = '';

function ServiceProvider({
    categoryOclData,
    serviceName,
    confirmUnregister,
}: {
    categoryOclData: CategoryOclVo[];
    serviceName: string;
    confirmUnregister: (disabled: boolean) => void;
}): JSX.Element {
    const [activeKey, setActiveKey] = useState<string>('');
    const [serviceDetails, setServiceDetails] = useState<UserAvailableServiceVo | undefined>(undefined);
    const [serviceAreas, setServiceAreas] = useState<Area[]>([]);

    const detailMapper: Map<string, UserAvailableServiceVo> = new Map<string, UserAvailableServiceVo>();
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    const [name, version] = serviceName.split('@');
    const unregisterStatus = useRef<string>('');
    const [unregisterTips, setUnregisterTips] = useState<JSX.Element | undefined>(undefined);
    const [unregisterServiceId, setUnregisterServiceId] = useState<string>('');
    const [unregisterTabsItemDisabled, setUnregisterTabsItemDisabled] = useState<boolean>(false);

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

    const items: Tab[] = categoryOclData
        .filter((service: CategoryOclVo) => service.name === name)
        .flatMap((service: CategoryOclVo) => service.versions)
        .filter((v) => v.version === version)
        .flatMap((v) => {
            return v.cloudProvider.map((cloudProvider: ProviderOclVo) => {
                const key = serviceName + '@' + cloudProvider.name;
                detailMapper.set(key, cloudProvider.details[0]);
                const result: Map<string, Region[]> = groupRegionsByArea(cloudProvider.details[0].regions);
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
                const name = cloudProvider.name.toString();
                return {
                    label: (
                        <div>
                            <Image width={120} preview={false} src={cspMap.get(cloudProvider.name)?.logo} />
                        </div>
                    ),
                    key: name,
                    children: [],
                    disabled: unregisterTabsItemDisabled,
                };
            });
        });

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
        if (items.length > 0 && lastServiceName !== serviceName) {
            updateServiceDetails(serviceName + '@' + items[0].key);
            setActiveKey(items[0]?.key);
        } else if (items.length > 0 && lastServiceName === serviceName) {
            setActiveKey(items[0]?.key);
        }
        lastServiceName = serviceName;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceName]);

    useEffect(() => {
        updateServiceDetails(serviceName + '@' + activeKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey]);

    const onChange = (key: string) => {
        setActiveKey(key);
    };

    function setUnregisterTipsInfo(unregisterResult: boolean, msg: string) {
        setUnregisterTips(
            <div className={'submit-alert-tip'}>
                {' '}
                {unregisterResult ? (
                    <Alert
                        message='Unregister:'
                        description={msg}
                        showIcon
                        type={'success'}
                        closable={true}
                        onClose={onRemove}
                    />
                ) : (
                    <Alert message='Unregister:' description={msg} showIcon type={'error'} closable={true} />
                )}{' '}
            </div>
        );
    }

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const onConfirmUnregister = async (msg: string, isUnregisterSuccessful: boolean, id: string) => {
        setUnregisterTipsInfo(isUnregisterSuccessful, msg);
        setUnregisterServiceId(id);
        unregisterStatus.current = isUnregisterSuccessful ? 'completed' : 'error';
        confirmUnregister(true);
        setUnregisterTabsItemDisabled(true);
        if (isUnregisterSuccessful) {
            await sleep(500);
            window.location.reload();
        }
    };

    const onRemove = () => {
        window.location.reload();
    };

    return (
        <>
            {serviceName.length > 0 && categoryOclData.length > 0 ? (
                <>
                    {serviceDetails !== undefined && unregisterServiceId === serviceDetails.id ? unregisterTips : ''}
                    <Tabs items={items} onChange={onChange} activeKey={activeKey} className={'ant-tabs-tab-btn'} />
                    {serviceDetails !== undefined ? (
                        <>
                            <ServiceDetail serviceDetails={serviceDetails} serviceAreas={serviceAreas} />
                            <div className={'update-unregister-btn-class'}>
                                <UpdateService id={serviceDetails.id} unregisterStatus={unregisterStatus} />
                                <UnregisterService
                                    id={serviceDetails.id}
                                    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                                    onConfirmHandler={onConfirmUnregister}
                                />
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
