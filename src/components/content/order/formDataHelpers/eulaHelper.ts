/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getEulaByCsp(
    selectCsp: UserOrderableServiceVo['csp'] | undefined,
    services: UserOrderableServiceVo[] | undefined
): string | undefined {
    let eula: string | undefined = undefined;
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                eula = userOrderableServiceVo.eula;
            }
        });
    }
    return eula;
}
