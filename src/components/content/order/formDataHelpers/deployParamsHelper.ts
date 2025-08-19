/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    BillingMode,
    Csp,
    Region,
    SensitiveScope,
    ServiceHostingType,
    ServiceProviderContactDetails,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { OrderSubmitProps } from '../common/utils/OrderSubmitProps';
import { DeployParam } from '../types/DeployParam';

export const getDeployParams = (
    userOrderableServiceVoList: UserOrderableServiceVo[],
    selectCsp: Csp,
    selectServiceHostingType: ServiceHostingType,
    region: Region,
    selectFlavor: string,
    currentContactServiceDetails: ServiceProviderContactDetails | undefined,
    availabilityZones: Record<string, string> | undefined,
    eula: string | undefined,
    selectBillingMode: BillingMode
): OrderSubmitProps => {
    let service: UserOrderableServiceVo | undefined;
    let registeredServiceId = '';
    let props: OrderSubmitProps;

    userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
        if (userOrderableServiceVo.csp === selectCsp) {
            registeredServiceId = userOrderableServiceVo.serviceTemplateId;
            service = userOrderableServiceVo;
        }
    });

    if (service) {
        props = {
            category: service.category,
            csp: service.csp,
            id: registeredServiceId,
            name: service.name,
            version: service.version,
            region: region,
            area: region.area,
            flavor: selectFlavor,
            params: new Array<DeployParam>(),
            serviceHostingType: selectServiceHostingType,
            serviceVendor: service.serviceVendor,
            contactServiceDetails: currentContactServiceDetails ?? undefined,
            availabilityZones: availabilityZones,
            eula: eula,
            billingMode: selectBillingMode,
        };

        for (const param of service.inputVariables) {
            props.params.push({
                name: param.name,
                kind: param.kind,
                type: param.dataType,
                example: param.example ?? '',
                description: param.description,
                value: param.value ?? '',
                mandatory: param.mandatory,
                sensitiveScope: param.sensitiveScope ?? SensitiveScope.NONE,
                valueSchema: param.valueSchema ?? undefined,
                autoFill: param.autoFill ?? undefined,
            });
        }
        return props;
    }
    throw new Error('No valid service found');
};
