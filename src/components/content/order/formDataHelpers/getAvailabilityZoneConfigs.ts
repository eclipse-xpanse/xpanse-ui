/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AvailabilityZoneConfig, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailabilityZoneConfigs(
    selectCsp: UserOrderableServiceVo.csp,
    services: UserOrderableServiceVo[] | undefined
): AvailabilityZoneConfig[] | undefined {
    let availabilityZoneConfigs: AvailabilityZoneConfig[] | undefined = undefined;
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                availabilityZoneConfigs = userOrderableServiceVo.serviceAvailability;
            }
        });
    }
    return availabilityZoneConfigs;
}
