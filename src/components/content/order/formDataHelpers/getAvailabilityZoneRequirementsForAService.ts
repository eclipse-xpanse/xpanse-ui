/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AvailabilityZoneConfig, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailabilityZoneRequirementsForAService(
    selectCsp: string,
    services: UserOrderableServiceVo[] | undefined
): AvailabilityZoneConfig[] {
    let availabilityZoneConfigs: AvailabilityZoneConfig[] = [];
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                availabilityZoneConfigs = userOrderableServiceVo.serviceAvailabilityConfigs ?? [];
            }
        });
    }
    return availabilityZoneConfigs;
}
