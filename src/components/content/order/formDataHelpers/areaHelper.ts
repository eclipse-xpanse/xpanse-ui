/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Region, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../types/Area';
import { Tab } from 'rc-tabs/lib/interface';

export function getAreasForSelectedVersionHostingTypeAndCsp(
    selectVersion: string,
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Area[] {
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    versionMapper.forEach((v, k) => {
        if (k !== selectVersion) {
            return [];
        }
        for (const userOrderableServiceVo of v) {
            if (
                userOrderableServiceVo.csp === selectCsp &&
                userOrderableServiceVo.serviceHostingType === selectServiceHostingType
            ) {
                const areaRegions: Map<string, Region[]> = new Map<string, Region[]>();
                for (const region of userOrderableServiceVo.regions) {
                    if (region.area && !areaRegions.has(region.area)) {
                        areaRegions.set(
                            region.area,
                            userOrderableServiceVo.regions.filter((data) => data.area === region.area)
                        );
                    }
                }
                const areas: Area[] = [];
                areaRegions.forEach((areaRegions, area) => {
                    const regionNames: string[] = [];
                    areaRegions.forEach((region) => {
                        if (region.name) {
                            regionNames.push(region.name);
                        }
                    });
                    areas.push({ name: area, regions: regionNames });
                });
                areaMapper.set(userOrderableServiceVo.csp, areas);
            }
        }
    });
    return areaMapper.get(selectCsp) ?? [];
}

export function convertAreasToTabs(
    selectVersion: string,
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Tab[] {
    const areaList: Area[] = getAreasForSelectedVersionHostingTypeAndCsp(
        selectVersion,
        selectCsp,
        selectServiceHostingType,
        versionMapper
    );
    let areaTabs: Tab[] = [];
    if (areaList.length > 0) {
        areaTabs = areaList.map((area: Area) => {
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
    }
    return areaTabs;
}
