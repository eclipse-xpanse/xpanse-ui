/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { csp, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getCspListForVersion(
    selectVersion: string,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): csp[] {
    const cspList: csp[] = [];

    versionMapper.forEach((v, k) => {
        if (k === selectVersion) {
            for (const userOrderableServiceVo of v) {
                if (!cspList.includes(userOrderableServiceVo.csp as csp)) {
                    cspList.push(userOrderableServiceVo.csp as csp);
                }
            }
        }
    });
    return cspList;
}
