/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Billing, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getBilling(
    csp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    versionMapper: UserOrderableServiceVo[] | undefined
): Billing {
    let billing: Billing = {
        // TODO Will be fixed in #1591 or #1592
        billingModes: ['fixed'],
    };
    if (versionMapper) {
        versionMapper.forEach((userOrderableServiceVo) => {
            if (
                csp === userOrderableServiceVo.csp &&
                selectServiceHostingType === userOrderableServiceVo.serviceHostingType
            ) {
                billing = userOrderableServiceVo.billing;
            }
        });
    }
    return billing;
}
