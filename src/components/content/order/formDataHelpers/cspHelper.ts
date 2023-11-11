/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getCspListForVersion(
    selectVersion: string,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): UserOrderableServiceVo.csp[] {
    const cspList: UserOrderableServiceVo.csp[] = [];

    versionMapper.forEach((v, k) => {
        if (k === selectVersion) {
            for (const userOrderableServiceVo of v) {
                if (!cspList.includes(userOrderableServiceVo.csp)) {
                    cspList.push(userOrderableServiceVo.csp);
                }
            }
        }
    });
    return cspList;
}
