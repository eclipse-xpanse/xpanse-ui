/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FlavorPriceResult } from '../../../../xpanse-api/generated';

/**
 * The flavors of the orderable service.
 */
export interface ServiceFlavorWithPriceResult {
    /**
     * The flavor name
     */
    name: string;
    /**
     * The properties of the flavor
     */
    properties: Record<string, string>;
    /**
     * The priority of the flavor. The larger value means lower priority.
     */
    priority: number;
    /**
     * Important features and differentiators of the flavor.
     */
    features?: string[];
    /**
     * prices of the flavor.
     */
    price: FlavorPriceResult;
}
