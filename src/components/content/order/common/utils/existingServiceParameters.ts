/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    DeployedService,
    DeployedServiceDetails,
    VendorHostedDeployedServiceDetails,
} from '../../../../../xpanse-api/generated';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../../utils/constants';

export function getExistingServiceParameters(deployedService: DeployedService): Record<string, unknown> {
    const variables: Record<string, unknown> = {};
    variables[CUSTOMER_SERVICE_NAME_FIELD] = deployedService.customerServiceName;
    if (deployedService.serviceHostingType === DeployedService.serviceHostingType.SELF) {
        const selfHostedService = deployedService as DeployedServiceDetails;
        for (const key in selfHostedService.deployRequest.serviceRequestProperties) {
            variables[key] = selfHostedService.deployRequest.serviceRequestProperties[key];
        }
    }
    if (deployedService.serviceHostingType === DeployedService.serviceHostingType.SERVICE_VENDOR) {
        const selfHostedService = deployedService as VendorHostedDeployedServiceDetails;
        for (const key in selfHostedService.deployRequest.serviceRequestProperties) {
            variables[key] = selfHostedService.deployRequest.serviceRequestProperties[key];
        }
    }
    return variables;
}
