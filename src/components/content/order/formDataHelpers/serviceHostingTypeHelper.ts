/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailableServiceHostingTypes(
    selectCsp: UserOrderableServiceVo.csp,
    services: UserOrderableServiceVo[] | undefined
): UserOrderableServiceVo.serviceHostingType[] {
    const availableServiceHostingTypes: UserOrderableServiceVo.serviceHostingType[] = [];
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                if (!availableServiceHostingTypes.includes(userOrderableServiceVo.serviceHostingType)) {
                    availableServiceHostingTypes.push(userOrderableServiceVo.serviceHostingType);
                }
            }
        });
    }
    return availableServiceHostingTypes;
}
