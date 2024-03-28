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
        billingModel: Billing.billingModel.MONTHLY,
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
