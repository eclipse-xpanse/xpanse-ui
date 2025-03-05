/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    billingMode,
    category,
    csp,
    Region,
    sensitiveScope,
    serviceHostingType,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { DeployParam } from '../types/DeployParam';

export const getDeployParams = (
    userOrderableServiceVoList: UserOrderableServiceVo[],
    selectCsp: csp,
    selectServiceHostingType: serviceHostingType,
    region: Region,
    selectFlavor: string,
    currentContactServiceDetails: ServiceProviderContactDetails | undefined,
    availabilityZones: Record<string, string> | undefined,
    eula: string | undefined,
    selectBillingMode: billingMode
): OrderSubmitProps => {
    let service: UserOrderableServiceVo | undefined;
    let registeredServiceId = '';

    userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
        if (userOrderableServiceVo.csp === selectCsp) {
            registeredServiceId = userOrderableServiceVo.serviceTemplateId;
            service = userOrderableServiceVo;
        }
    });

    const props: OrderSubmitProps = {
        category: service?.category as category,
        csp: service?.csp as csp,
        id: registeredServiceId,
        name: service?.name ?? '',
        version: service?.version ?? '',
        region: region,
        area: region.area,
        flavor: selectFlavor,
        params: new Array<DeployParam>(),
        serviceHostingType: selectServiceHostingType,
        serviceVendor: service?.serviceVendor ?? '',
        contactServiceDetails: currentContactServiceDetails ?? undefined,
        availabilityZones: availabilityZones,
        eula: eula,
        billingMode: selectBillingMode,
    };

    if (service !== undefined) {
        for (const param of service.inputVariables) {
            props.params.push({
                name: param.name,
                kind: param.kind,
                type: param.dataType,
                example: param.example ?? '',
                description: param.description,
                value: param.value ?? '',
                mandatory: param.mandatory,
                sensitiveScope: param.sensitiveScope ?? sensitiveScope.NONE,
                valueSchema: param.valueSchema ?? undefined,
                autoFill: param.autoFill ?? undefined,
            });
        }
    }

    return props;
};
