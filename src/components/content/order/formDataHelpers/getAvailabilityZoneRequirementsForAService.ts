/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AvailabilityZoneConfig, csp, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailabilityZoneRequirementsForAService(
    selectCsp: csp,
    services: UserOrderableServiceVo[] | undefined
): AvailabilityZoneConfig[] {
    let availabilityZoneConfig: AvailabilityZoneConfig[] = [];
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                availabilityZoneConfig = userOrderableServiceVo.serviceAvailabilityConfig ?? [];
            }
        });
    }
    return availabilityZoneConfig;
}
