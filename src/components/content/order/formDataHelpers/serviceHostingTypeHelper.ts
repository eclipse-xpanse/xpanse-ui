/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { csp, serviceHostingType, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailableServiceHostingTypes(
    selectCsp: csp,
    services: UserOrderableServiceVo[] | undefined
): serviceHostingType[] {
    const availableServiceHostingTypes: serviceHostingType[] = [];
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                if (
                    !availableServiceHostingTypes.includes(
                        userOrderableServiceVo.serviceHostingType as serviceHostingType
                    )
                ) {
                    availableServiceHostingTypes.push(userOrderableServiceVo.serviceHostingType as serviceHostingType);
                }
            }
        });
    }
    return availableServiceHostingTypes;
}
