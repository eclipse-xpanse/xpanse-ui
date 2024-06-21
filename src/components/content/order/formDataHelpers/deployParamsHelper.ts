/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    DeployRequest,
    Region,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';

export const getDeployParams = (
    userOrderableServiceVoList: UserOrderableServiceVo[],
    selectCsp: UserOrderableServiceVo['csp'],
    selectServiceHostingType: UserOrderableServiceVo['serviceHostingType'],
    region: Region,
    selectFlavor: string,
    currentContactServiceDetails: ServiceProviderContactDetails | undefined,
    availabilityZones: Record<string, string> | undefined,
    eula: string | undefined,
    selectBillingMode: DeployRequest['billingMode']
): OrderSubmitProps => {
    const service = userOrderableServiceVoList.find(
        (userOrderableServiceVo) => userOrderableServiceVo.csp === selectCsp
    );

    if (!service) {
        throw new Error('Selected CSP service not found.');
    }

    const params = service.variables.map((param) => ({
        name: param.name,
        kind: param.kind,
        type: param.dataType,
        example: param.example ?? '',
        description: param.description,
        value: param.value ?? '',
        mandatory: param.mandatory,
        sensitiveScope: param.sensitiveScope ?? 'none',
        valueSchema: param.valueSchema as Record<string, unknown>,
        autoFill: param.autoFill ?? undefined,
    }));

    return {
        id: service.serviceTemplateId,
        category: service.category,
        name: service.name,
        version: service.version,
        region: region.name,
        area: region.area,
        csp: service.csp,
        flavor: selectFlavor,
        params: params,
        serviceHostingType: selectServiceHostingType,
        contactServiceDetails: currentContactServiceDetails,
        availabilityZones: availabilityZones,
        eula: eula,
        billingMode: selectBillingMode,
    };
};
