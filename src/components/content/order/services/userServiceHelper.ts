/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export const groupServicesByName = (
    userOrderableServiceList: UserOrderableServiceVo[]
): Map<string, UserOrderableServiceVo[]> => {
    const serviceMapper: Map<string, UserOrderableServiceVo[]> = new Map<string, UserOrderableServiceVo[]>();
    for (const userOrderableService of userOrderableServiceList) {
        if (userOrderableService.name) {
            if (!serviceMapper.has(userOrderableService.name)) {
                serviceMapper.set(
                    userOrderableService.name,
                    userOrderableServiceList.filter((data) => data.name === userOrderableService.name)
                );
            }
        }
    }

    return serviceMapper;
};

export const groupVersionsForService = (
    userOrderableServiceList: UserOrderableServiceVo[]
): Map<string, UserOrderableServiceVo[]> => {
    const versionMapper: Map<string, UserOrderableServiceVo[]> = new Map<string, UserOrderableServiceVo[]>();
    userOrderableServiceList.forEach((service) => {
        if (versionMapper.has(service.version)) {
            versionMapper.get(service.version)?.push(service);
        } else {
            versionMapper.set(service.version, [service]);
        }
    });
    return versionMapper;
};
