/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Csp, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getCspListForVersion(
    selectVersion: string,
    versionMapper: Map<string, UserOrderableServiceVo[]>
): Csp[] {
    const cspList: Csp[] = [];

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
