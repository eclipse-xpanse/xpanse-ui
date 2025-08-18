/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tab } from 'rc-tabs/lib/interface';
import { Csp, Region, ServiceHostingType, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../types/Area';

export function getAreasForSelectedVersionHostingTypeAndCsp(
    selectCsp: Csp,
    selectServiceHostingType: ServiceHostingType,
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
                    areas.push({ name: area, regions: areaRegions });
                });
                areaMapper.set(userOrderableServiceVo.csp, areas);
            }
        });
    }
    return areaMapper.get(selectCsp) ?? [];
}

export function convertAreasToTabs(
    selectCsp: Csp,
    selectServiceHostingType: ServiceHostingType,
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
