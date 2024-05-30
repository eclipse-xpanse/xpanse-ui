/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceFlavor, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getServiceFlavorList(
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): ServiceFlavor[] {
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

    return flavorMapper.get(selectCsp) ?? [];
}
