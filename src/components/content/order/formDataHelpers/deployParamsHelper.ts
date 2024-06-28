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
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { DeployParam } from '../types/DeployParam';

export const getDeployParams = (
    userOrderableServiceVoList: UserOrderableServiceVo[],
    selectCsp: string,
    selectServiceHostingType: string,
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
        id: registeredServiceId,
        category: service?.category as category,
        name: service?.name ?? '',
        version: service?.version ?? '',
        region: region.name,
        area: region.area,
        csp: service?.csp as csp,
        flavor: selectFlavor,
        params: new Array<DeployParam>(),
        serviceHostingType: selectServiceHostingType,
        contactServiceDetails: currentContactServiceDetails ?? undefined,
        availabilityZones: availabilityZones,
        eula: eula,
        billingMode: selectBillingMode,
    };

    if (service !== undefined) {
        for (const param of service.variables) {
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
