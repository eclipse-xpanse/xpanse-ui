/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tabs } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Area } from '../../../utils/Area';
import { Tab } from 'rc-tabs/lib/interface';
import { Ocl, Region, RegisterServiceEntity } from '../../../../xpanse-api/generated';

function groupRegionsByArea(regions: Array<Region>): Map<string, any[]> {
    let map: Map<string, any[]> = new Map<string, any[]>();
    for (let val of regions) {
        if (!map.has(val.area as string)) {
            map.set(
                val.area as string,
                regions.filter((data) => data.area === val.area)
            );
        }
    }
    return map;
}

export function filterAreaList(
    selectVersion: string,
    selectCsp: string,
    versionMapper: Map<string, RegisterServiceEntity[]>
): Area[] {
    let oclList: Ocl[] = [];
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    versionMapper.forEach((v, k) => {
        if (k === selectVersion) {
            let ocls: Ocl[] = [];
            for (let registerServiceEntity of v) {
                if (registerServiceEntity.ocl instanceof Ocl) {
                    ocls.push(registerServiceEntity.ocl);
                }
            }
            oclList = ocls;
        }
    });
    oclList
        .filter((v) => (v as Ocl).serviceVersion === selectVersion)
        .forEach((v) => {
            if (!v || !v.cloudServiceProvider) {
                return { key: '', label: '' };
            }
            if (!v.cloudServiceProvider.name) {
                return { key: '', label: '' };
            }
            if (v.cloudServiceProvider.name !== selectCsp) {
                return { key: '', label: '' };
            }
            const areaRegions: Map<string, Region[]> = groupRegionsByArea(v.cloudServiceProvider.regions);
            let areas: Area[] = [];
            areaRegions.forEach((areaRegions, area) => {
                let regionNames: string[] = [];
                areaRegions.forEach((region) => {
                    if (region.name != null) {
                        regionNames.push(region.name);
                    }
                });
                areas.push({ name: area, regions: regionNames });
            });
            areaMapper.set(v.cloudServiceProvider.name || '', areas || []);
        });
    return areaMapper.get(selectCsp) || [];
}

export default function AreaSelect({
    selectVersion,
    selectCsp,
    versionMapper,
    onChangeHandler,
}: {
    selectVersion: string;
    selectCsp: string;
    versionMapper: Map<string, RegisterServiceEntity[]>;
    onChangeHandler: (value: string) => void;
}): JSX.Element {
    const [selectArea, setSelectArea] = useState<string>('');
    const [items, setItems] = useState<Tab[]>([]);

    const onChangeAreaValue = useCallback(
        (key: string) => {
            setSelectArea(key);
            onChangeHandler(key);
        },
        [onChangeHandler]
    );

    useEffect(() => {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper);
        if (areaList.length > 0) {
            const areaItems: Tab[] = areaList.map((area: Area) => {
                if (!area.name) {
                    return { key: '', label: '' };
                }
                const name = area.name;
                return {
                    label: name,
                    key: name,
                    children: [],
                };
            });

            setItems(areaItems);
            if (onChangeAreaValue !== undefined) {
                onChangeAreaValue(areaList[0].name);
            }
        } else {
            return;
        }
    }, [onChangeAreaValue, selectCsp, selectVersion, versionMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class content-title'}>
                <Tabs
                    type='card'
                    size='middle'
                    activeKey={selectArea}
                    tabPosition={'top'}
                    items={items}
                    onChange={onChangeAreaValue}
                />
            </div>
        </>
    );
}
