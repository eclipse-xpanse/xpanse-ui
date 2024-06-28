/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { csp, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailableServiceHostingTypes(
    selectCsp: csp,
    services: UserOrderableServiceVo[] | undefined
): string[] {
    const availableServiceHostingTypes: string[] = [];
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
