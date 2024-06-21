/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceProviderContactDetails, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export function getContactServiceDetailsOfServiceByCsp(
    selectCsp: UserOrderableServiceVo['csp'] | undefined,
    services: UserOrderableServiceVo[] | undefined
): ServiceProviderContactDetails | undefined {
    if (!selectCsp || !services) {
        return undefined;
    }

    const service = services.find((service) => service.csp === selectCsp);

    if (service) {
        return service.serviceProviderContactDetails;
    }
}
