/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    billingMode,
    category,
    csp,
    Region,
    serviceHostingType,
    ServiceProviderContactDetails,
} from '../../../../../xpanse-api/generated';
import { DeployParam } from '../../types/DeployParam';

export interface OrderSubmitProps {
    id: string;
    category: category;
    name: string;
    serviceVendor: string;
    version: string;
    region: Region;
    area: string;
    csp: csp;
    flavor: string;
    params: DeployParam[];
    serviceHostingType: serviceHostingType;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
    availabilityZones?: Record<string, string>;
    eula: string | undefined;
    billingMode: billingMode;
}
