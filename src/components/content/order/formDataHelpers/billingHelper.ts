/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployRequest, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getBillingModes(
    csp: UserOrderableServiceVo['csp'] | undefined,
    selectServiceHostingType: UserOrderableServiceVo['serviceHostingType'] | undefined,
    versionMapper: UserOrderableServiceVo[] | undefined
): DeployRequest['billingMode'][] | undefined {
    let billingMode: DeployRequest['billingMode'][] = [];
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
    csp: UserOrderableServiceVo['csp'] | undefined,
    selectServiceHostingType: UserOrderableServiceVo['serviceHostingType'] | undefined,
    versionMapper: UserOrderableServiceVo[] | undefined
): DeployRequest['billingMode'] | undefined {
    let defaultBillingMode: DeployRequest['billingMode'] | undefined = undefined;
    if (versionMapper) {
        versionMapper.forEach((userOrderableServiceVo) => {
            if (
                csp === userOrderableServiceVo.csp &&
                selectServiceHostingType === userOrderableServiceVo.serviceHostingType &&
                userOrderableServiceVo.billing.defaultBillingMode
            ) {
                defaultBillingMode =
                    userOrderableServiceVo.billing.defaultBillingMode.toString() as DeployRequest['billingMode'];
            }
        });
    }
    return defaultBillingMode;
}
