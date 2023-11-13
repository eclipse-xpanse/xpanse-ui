/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Region } from '../types/Region';
import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../types/Area';
import { getAreasForSelectedVersionHostingTypeAndCsp } from './areaHelper';

export function getRegionDropDownValues(
    selectVersion: string,
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    selectArea: string,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Region[] {
    const areaList: Area[] = getAreasForSelectedVersionHostingTypeAndCsp(
        selectVersion,
        selectCsp,
        selectServiceHostingType,
        versionMapper
    );
    let regions: Region[] = [];
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
