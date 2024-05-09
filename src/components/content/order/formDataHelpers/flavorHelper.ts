/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Flavor } from '../types/Flavor';
import { ServiceFlavor, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getFlavorList(
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): Flavor[] {
    const flavorMapper: Map<string, ServiceFlavor[]> = new Map<string, ServiceFlavor[]>();
    if (userOrderableServices) {
        userOrderableServices.forEach((userOrderableServiceVo) => {
            if (
                userOrderableServiceVo.csp === selectCsp &&
                userOrderableServiceVo.serviceHostingType === selectServiceHostingType
            ) {
                flavorMapper.set(userOrderableServiceVo.csp, userOrderableServiceVo.flavors);
            }
        });
    }

    const flavorList = flavorMapper.get(selectCsp) ?? [];
    const flavors: Flavor[] = [];
    if (flavorList.length > 0) {
        for (const flavor of flavorList) {
            // TODO will be fixed after #1597 is fixed
            const flavorItem = { value: flavor.name, label: flavor.name, price: (20).toString() };
            flavors.push(flavorItem);
        }
    }

    return flavors;
}
