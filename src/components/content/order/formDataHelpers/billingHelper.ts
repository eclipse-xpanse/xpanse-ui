/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Billing, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getBilling(
    selectVersion: string,
    csp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Billing {
    let billing: Billing = {
        model: '' as string,
        period: 'daily' as Billing.period,
        currency: 'euro' as Billing.currency,
    };
    versionMapper.forEach((v, k) => {
        if (selectVersion === k) {
            v.forEach((userOrderableServiceVo) => {
                if (
                    csp === userOrderableServiceVo.csp &&
                    selectServiceHostingType === userOrderableServiceVo.serviceHostingType
                ) {
                    billing = userOrderableServiceVo.billing;
                }
            });
        }
    });
    return billing;
}
