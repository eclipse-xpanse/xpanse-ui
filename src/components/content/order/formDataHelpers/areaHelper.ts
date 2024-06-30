/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tab } from 'rc-tabs/lib/interface';
import { csp, Region, serviceHostingType, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../types/Area';

export function getAreasForSelectedVersionHostingTypeAndCsp(
    selectCsp: string,
    selectServiceHostingType: serviceHostingType,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): Area[] {
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    if (userOrderableServices) {
        userOrderableServices.forEach((userOrderableServiceVo) => {
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
        });
    }
    return areaMapper.get(selectCsp) ?? [];
}

export function convertAreasToTabs(
    selectCsp: csp,
    selectServiceHostingType: serviceHostingType,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): Tab[] {
    const areaList: Area[] = getAreasForSelectedVersionHostingTypeAndCsp(
        selectCsp,
        selectServiceHostingType,
        userOrderableServices
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
