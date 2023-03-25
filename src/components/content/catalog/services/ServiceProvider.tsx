/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import ServiceDetail from './ServiceDetail';
import { CategoryOclVo, OclDetailVo, ProviderOclVo, Region, VersionOclVo } from '../../../../xpanse-api/generated';
import { Tab } from 'rc-tabs/lib/interface';
import { Area } from '../../../utils/Area';

let lastServiceName: string = '';

function ServiceProvider({
    categoryOclData,
    serviceName,
}: {
    categoryOclData: CategoryOclVo[];
    serviceName: string;
}): JSX.Element {
    const [activeKey, setActiveKey] = useState<string>('');
    const [serviceDetails, setServiceDetails] = useState<OclDetailVo>(new OclDetailVo());
    const [serviceAreas, setServiceAreas] = useState<Area[]>([]);

    const detailMapper: Map<string, OclDetailVo> = new Map<string, OclDetailVo>();
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    const [name, version] = serviceName.split('@');

    function group(list: any[], key: string): Map<string, any[]> {
        let map: Map<string, any[]> = new Map<string, any[]>();
        list.map((val) => {
            if (!map.has(val[key])) {
                map.set(
                    val[key],
                    list.filter((data) => data[key] === val[key])
                );
            }
        });
        return map;
    }

    const items: Tab[] = categoryOclData
        .filter((service: CategoryOclVo) => service.name === name)
        .flatMap((service: CategoryOclVo) => service.versions)
        .filter((v) => (v as VersionOclVo).version === version)
        .flatMap((v) => {
            if (!v || !v.cloudProvider) {
                return { key: '', label: '' };
            }
            return v.cloudProvider.map((cloudProvider: ProviderOclVo) => {
                if (!cloudProvider.details) {
                    return { key: '', label: '' };
                }
                const key = serviceName + '@' + cloudProvider.name;
                detailMapper.set(key, cloudProvider.details[0]);
                const result: Map<string, Region[]> = group(cloudProvider.regions, 'area');
                let areas: Area[] = [];

                result.forEach((v, k) => {
                    let regions: string[] = [];

                    v.forEach((region) => {
                        if (region.name != null) {
                            regions.push(region.name);
                        }
                    });
                    let area: Area = { name: k, regions: regions };
                    areas.push(area);
                });

                areaMapper.set(key, areas);
                const name = cloudProvider.name!.toString();
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
            setActiveKey(items[0]!.key);
        } else if (items.length > 0 && lastServiceName === serviceName) {
            setActiveKey(items[0]!.key);
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

    return (
        <>
            {serviceName.length > 0 ? (
                <>
                    <Tabs items={items} onChange={onChange} activeKey={activeKey} className={'ant-tabs-tab-btn'} />
                    <ServiceDetail serviceDetails={serviceDetails} serviceAreas={serviceAreas} />
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default ServiceProvider;
