/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { billingMode, category, csp, ServiceProviderContactDetails } from '../../../../../xpanse-api/generated';
import { DeployParam } from '../../types/DeployParam';

export interface OrderSubmitProps {
    id: string;
    category: category;
    name: string;
    version: string;
    region: string;
    area: string;
    csp: csp;
    flavor: string;
    params: DeployParam[];
    serviceHostingType: string;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
    availabilityZones?: Record<string, string>;
    eula: string | undefined;
    billingMode: billingMode;
}
