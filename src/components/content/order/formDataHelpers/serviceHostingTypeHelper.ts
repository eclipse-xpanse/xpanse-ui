/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getAvailableServiceHostingTypes(
    selectVersion: string,
    selectCsp: UserOrderableServiceVo.csp,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): UserOrderableServiceVo.serviceHostingType[] {
    const availableServiceHostingTypes: UserOrderableServiceVo.serviceHostingType[] = [];
    // eslint-disable-next-line no-console
    console.log(versionMapper);
    if (versionMapper.has(selectVersion) && versionMapper.get(selectVersion)) {
        versionMapper.get(selectVersion)?.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                if (!availableServiceHostingTypes.includes(userOrderableServiceVo.serviceHostingType)) {
                    availableServiceHostingTypes.push(userOrderableServiceVo.serviceHostingType);
                }
            }
        });
    }
    // eslint-disable-next-line no-console
    console.log(availableServiceHostingTypes);
    return availableServiceHostingTypes;
}
