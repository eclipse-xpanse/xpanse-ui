/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { billingMode, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getBillingModes(
    csp: string,
    selectServiceHostingType: string,
    versionMapper: UserOrderableServiceVo[] | undefined
): billingMode[] | undefined {
    let billingMode: billingMode[] = [];
    if (versionMapper) {
        versionMapper.forEach((userOrderableServiceVo) => {
            if (
                csp === userOrderableServiceVo.csp &&
                selectServiceHostingType === userOrderableServiceVo.serviceHostingType
            ) {
                billingMode = userOrderableServiceVo.billing.billingModes as billingMode[];
            }
        });
    }
    return billingMode;
}

export function getDefaultBillingMode(
    csp: string,
    selectServiceHostingType: string,
    versionMapper: UserOrderableServiceVo[] | undefined
): billingMode | undefined {
    let defaultBillingMode: billingMode | undefined = undefined;
    if (versionMapper) {
        versionMapper.forEach((userOrderableServiceVo) => {
            if (
                csp === userOrderableServiceVo.csp &&
                selectServiceHostingType === userOrderableServiceVo.serviceHostingType &&
                userOrderableServiceVo.billing.defaultBillingMode
            ) {
                defaultBillingMode = userOrderableServiceVo.billing.defaultBillingMode.toString() as billingMode;
            }
        });
    }
    return defaultBillingMode;
}
