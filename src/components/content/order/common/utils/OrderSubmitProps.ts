/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    BillingMode,
    Category,
    Csp,
    Region,
    ServiceHostingType,
    ServiceProviderContactDetails,
} from '../../../../../xpanse-api/generated';
import { DeployParam } from '../../types/DeployParam';

export interface OrderSubmitProps {
    id: string;
    category: Category;
    name: string;
    serviceVendor: string;
    version: string;
    region: Region;
    area: string;
    csp: Csp;
    flavor: string;
    params: DeployParam[];
    serviceHostingType: ServiceHostingType;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
    availabilityZones?: Record<string, string>;
    eula: string | undefined;
    billingMode: BillingMode;
}
