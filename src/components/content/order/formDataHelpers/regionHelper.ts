/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Csp, Region, ServiceHostingType, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../types/Area';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { getAreasForSelectedVersionHostingTypeAndCsp } from './areaHelper';

export function getRegionDropDownValues(
    selectCsp: Csp,
    selectServiceHostingType: ServiceHostingType,
    selectArea: string,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): RegionDropDownInfo[] {
    const areaList: Area[] = getAreasForSelectedVersionHostingTypeAndCsp(
        selectCsp,
        selectServiceHostingType,
        userOrderableServices
    );
    let regions: RegionDropDownInfo[] = [];
    if (areaList.length > 0) {
        regions = areaList
            .filter((v) => v.name === selectArea)
            .flatMap((v) => {
                return v.regions.map((region) => {
                    const regionStr = formatRegionInfo(region, false);
                    return {
                        value: regionStr,
                        label: regionStr,
                        region: region,
                    };
                });
            });
    }
    return regions;
}

/**
 * Format the region info
 * @param region
 * @param shownArea
 */
export function formatRegionInfo(region: Region, shownArea: boolean): string {
    if (!region.name) {
        return '';
    }
    const siteName = region.site ? region.site : '';
    if (!shownArea) {
        return `${region.name} (site: ${siteName})`;
    }
    const areaName = region.area ? region.area : '';
    return `${region.name} (site: ${siteName}, area: ${areaName})`;
}

/**
 * Parse the region info.
 * @param formatRegionStr
 */
export function parseRegionInfo(formatRegionStr: string): Region {
    if (formatRegionStr) {
        const namePart = formatRegionStr.split('(')[0].trim();
        const bracketPart = formatRegionStr.split('(')[1]?.replace(')', '').trim();
        if (namePart && bracketPart) {
            const parts = bracketPart.split(', ');
            let siteName, areaName;
            for (const part of parts) {
                if (part.startsWith('site: ')) {
                    siteName = part.substring(6);
                } else if (part.startsWith('area: ')) {
                    areaName = part.substring(6);
                }
            }
            siteName ??= '';
            areaName ??= '';
            return { name: namePart, site: siteName, area: areaName };
        }
        return { area: '', name: '', site: '' };
    }
    return { area: '', name: '', site: '' };
}
