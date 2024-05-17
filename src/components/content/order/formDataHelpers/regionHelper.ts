/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../types/Area';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';
import { getAreasForSelectedVersionHostingTypeAndCsp } from './areaHelper';

export function getRegionDropDownValues(
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
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
                    if (!region) {
                        return { value: '', label: '' };
                    }
                    return {
                        value: region,
                        label: region,
                    };
                });
            });
    }
    return regions;
}
