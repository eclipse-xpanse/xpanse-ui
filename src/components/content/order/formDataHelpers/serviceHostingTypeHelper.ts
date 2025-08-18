/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Csp, ServiceHostingType, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailableServiceHostingTypes(
    selectCsp: Csp,
    services: UserOrderableServiceVo[] | undefined
): ServiceHostingType[] {
    const availableServiceHostingTypes: ServiceHostingType[] = [];
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
