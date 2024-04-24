/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { DeployParam } from '../types/DeployParam';
import {
    DeployedServiceDetails,
    DeployVariable,
    ServiceProviderContactDetails,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';

export const getModifyParams = (
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails,
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined,
    variables: DeployVariable[]
): OrderSubmitProps => {
    const orderSubmitProps: OrderSubmitProps = {
        id: currentSelectedService.serviceTemplateId ?? '',
        category: currentSelectedService.deployRequest.category,
        name: currentSelectedService.name,
        version: currentSelectedService.version,
        region: currentSelectedService.deployRequest.region.name,
        area: currentSelectedService.deployRequest.region.area,
        csp: currentSelectedService.deployRequest.csp,
        flavor: currentSelectedService.deployRequest.flavor,
        params: new Array<DeployParam>(),
        serviceHostingType: currentSelectedService.serviceHostingType,
        contactServiceDetails: serviceProviderContactDetails ?? undefined,
        availabilityZones: currentSelectedService.deployRequest.availabilityZones,
    };
    if (variables.length > 0) {
        for (const param of variables) {
            orderSubmitProps.params.push({
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
    return orderSubmitProps;
};
