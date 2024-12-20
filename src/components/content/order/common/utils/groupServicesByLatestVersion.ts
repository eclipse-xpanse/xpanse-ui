/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../../xpanse-api/generated';
import { sortVersion } from '../../../../utils/Sort.ts';
import { UserServiceLatestVersionDisplayType } from '../../services/UserServiceLatestVersionDisplayType.ts';
import { groupServicesByName, groupVersionsForService } from '../../services/userServiceHelper.ts';

export function groupServicesByLatestVersion(
    allServices: UserOrderableServiceVo[],
    filterByServiceName: string
): UserServiceLatestVersionDisplayType[] {
    const serviceList: UserServiceLatestVersionDisplayType[] = [];
    const servicesGroupedByName: Map<string, UserOrderableServiceVo[]> = groupServicesByName(allServices);
    servicesGroupedByName.forEach((orderableServicesList, _) => {
        const versionMapper: Map<string, UserOrderableServiceVo[]> = groupVersionsForService(orderableServicesList);
        const versionList: string[] = Array.from(versionMapper.keys());
        const latestVersion = sortVersion(versionList)[0];
        if (versionMapper.has(latestVersion) && versionMapper.get(latestVersion)) {
            if (versionMapper.get(latestVersion)?.[0].name.includes(filterByServiceName)) {
                const serviceItem = {
                    name: versionMapper.get(latestVersion)?.[0].name,
                    content: versionMapper.get(latestVersion)?.[0].description,
                    icon: versionMapper.get(latestVersion)?.[0].icon,
                    latestVersion: latestVersion,
                    category: versionMapper.get(latestVersion)?.[0].category,
                    serviceVendor: versionMapper.get(latestVersion)?.[0].serviceVendor,
                };
                serviceList.push(serviceItem as UserServiceLatestVersionDisplayType);
            }
        }
    });
    return serviceList;
}
