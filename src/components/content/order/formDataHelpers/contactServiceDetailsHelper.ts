/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Csp, ServiceProviderContactDetails, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getContactServiceDetailsOfServiceByCsp(
    selectCsp: Csp,
    services: UserOrderableServiceVo[] | undefined
): ServiceProviderContactDetails | undefined {
    let contactServiceDetails: ServiceProviderContactDetails | undefined = undefined;
    if (services) {
        services.forEach((userOrderableServiceVo) => {
            if (userOrderableServiceVo.csp === selectCsp) {
                contactServiceDetails = userOrderableServiceVo.serviceProviderContactDetails;
            }
        });
    }
    return contactServiceDetails;
}
