/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    DeployRequest,
    DeployVariable,
    Region,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { OrderSubmitProps } from '../create/OrderSubmit';
import { DeployParam } from '../types/DeployParam';

export const getDeployParams = (
    userOrderableServiceVoList: UserOrderableServiceVo[],
    selectCsp: UserOrderableServiceVo.csp,
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType,
    region: Region,
    selectFlavor: string,
    currentContactServiceDetails: ServiceProviderContactDetails | undefined
): OrderSubmitProps => {
    let service: UserOrderableServiceVo | undefined;
    let registeredServiceId = '';

    userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
        if (userOrderableServiceVo.csp === selectCsp) {
            registeredServiceId = userOrderableServiceVo.id;
            service = userOrderableServiceVo;
        }
    });

    const props: OrderSubmitProps = {
        id: registeredServiceId,
        category: service?.category as DeployRequest.category,
        name: service?.name ?? '',
        version: service?.version ?? '',
        region: region.name,
        area: region.area,
        csp: service?.csp as DeployRequest.csp,
        flavor: selectFlavor,
        params: new Array<DeployParam>(),
        serviceHostingType: selectServiceHostingType,
        contactServiceDetails: currentContactServiceDetails ?? undefined,
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
                sensitiveScope: param.sensitiveScope ?? DeployVariable.sensitiveScope.NONE,
                valueSchema: param.valueSchema ?? undefined,
                autoFill: param.autoFill ?? undefined,
            });
        }
    }

    return props;
};
