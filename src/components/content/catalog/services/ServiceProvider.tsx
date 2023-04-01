/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Alert, Tabs } from 'antd';
import ServiceDetail from './ServiceDetail';
import { CategoryOclVo, OclDetailVo, ProviderOclVo, Region } from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import { Area } from '../../../utils/Area';
import UpdateService from './UpdateService';
import UnregisterService from './UnregisterService';

let lastServiceName: string = '';

function ServiceProvider({
    categoryOclData,
    serviceName,
}: {
    categoryOclData: CategoryOclVo[];
    serviceName: string;
}): JSX.Element {
    const [activeKey, setActiveKey] = useState<string>('');
    const [serviceDetails, setServiceDetails] = useState<OclDetailVo | undefined>(undefined);
    const [serviceAreas, setServiceAreas] = useState<Area[]>([]);

    const detailMapper: Map<string, OclDetailVo> = new Map<string, OclDetailVo>();
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    const [name, version] = serviceName.split('@');
    const updateStatusWhenUnregister = useRef<string>('');
    const [unregisterTips, setUnregisterTips] = useState<JSX.Element | undefined>(undefined);

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
                const result: Map<string, Region[]> = groupRegionsByArea(cloudProvider.regions);
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
                    label: name,
                    key: name,
                    children: [],
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

    function setUnregisterTipsInfo(type: 'error' | 'success', msg: string) {
        setUnregisterTips(
            <div className={'submit-alert-tip'}>
                {' '}
                {type === 'success' ? (
                    <Alert
                        message='Unregister:'
                        description={msg}
                        showIcon
                        type={type}
                        closable={true}
                        onClose={onRemove}
                    />
                ) : (
                    <Alert message='Unregister:' description={msg} showIcon type={type} closable={true} />
                )}{' '}
            </div>
        );
    }

    const onConfirmUnregister = (type: string, msg: string, unregisterResult: MutableRefObject<string>) => {
        setUnregisterTipsInfo(type as 'success' | 'error', msg);
        updateStatusWhenUnregister.current = unregisterResult.current;
    };

    const onRemove = () => {
        window.location.reload();
    };

    return (
        <>
            {serviceName.length > 0 ? (
                <>
                    {unregisterTips}
                    <Tabs items={items} onChange={onChange} activeKey={activeKey} className={'ant-tabs-tab-btn'} />
                    {serviceDetails !== undefined ? (
                        <>
                            <ServiceDetail serviceDetails={serviceDetails} serviceAreas={serviceAreas} />
                            <div className={'update-unregister-btn-class'}>
                                <UpdateService
                                    id={serviceDetails.id}
                                    updateStatusWhenUnregister={updateStatusWhenUnregister}
                                />
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
