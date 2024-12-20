/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function serviceVendorHelper(
    selectCsp: string,
    selectServiceHostingType: string,
    userOrderableServices: UserOrderableServiceVo[] | undefined
): string {
    if (userOrderableServices) {
        for (const userOrderableServiceVo of userOrderableServices) {
            if (
                userOrderableServiceVo.csp === selectCsp &&
                userOrderableServiceVo.serviceHostingType === selectServiceHostingType
            ) {
                return userOrderableServiceVo.serviceVendor;
            }
        }
    }
    return '';
}
