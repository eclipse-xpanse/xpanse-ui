/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { BillingMode, Csp, ServiceHostingType, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getBillingModes(
    csp: Csp,
    selectServiceHostingType: ServiceHostingType,
    versionMapper: UserOrderableServiceVo[] | undefined
): BillingMode[] | undefined {
    let billingMode: BillingMode[] = [];
    if (versionMapper) {
        versionMapper.forEach((userOrderableServiceVo) => {
            if (
                csp === userOrderableServiceVo.csp &&
                selectServiceHostingType === userOrderableServiceVo.serviceHostingType
            ) {
                billingMode = userOrderableServiceVo.billing.billingModes;
            }
        });
    }
    return billingMode;
}

export function getDefaultBillingMode(
    csp: Csp,
    selectServiceHostingType: ServiceHostingType,
    versionMapper: UserOrderableServiceVo[] | undefined
): BillingMode | undefined {
    let defaultBillingMode: BillingMode | undefined = undefined;
    if (versionMapper) {
        versionMapper.forEach((userOrderableServiceVo) => {
            if (
                csp === userOrderableServiceVo.csp &&
                selectServiceHostingType === userOrderableServiceVo.serviceHostingType &&
                userOrderableServiceVo.billing.defaultBillingMode
            ) {
                defaultBillingMode = userOrderableServiceVo.billing.defaultBillingMode;
            }
        });
    }
    return defaultBillingMode;
}
