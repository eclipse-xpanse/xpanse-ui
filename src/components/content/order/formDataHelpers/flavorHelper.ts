/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Flavor } from '../types/Flavor';
import { FlavorBasic, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getFlavorList(
    selectVersion: string,
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Flavor[] {
    const flavorMapper: Map<string, FlavorBasic[]> = new Map<string, FlavorBasic[]>();
    versionMapper.forEach((v, k) => {
        if (k !== selectVersion) {
            return new Map<string, FlavorBasic[]>();
        }
        for (const userOrderableServiceVo of v) {
            if (
                userOrderableServiceVo.csp === selectCsp &&
                userOrderableServiceVo.serviceHostingType === selectServiceHostingType
            ) {
                flavorMapper.set(userOrderableServiceVo.csp, userOrderableServiceVo.flavors);
            }
        }
    });

    const flavorList = flavorMapper.get(selectCsp) ?? [];
    const flavors: Flavor[] = [];
    if (flavorList.length > 0) {
        for (const flavor of flavorList) {
            const flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
            flavors.push(flavorItem);
        }
    }

    return flavors;
}
