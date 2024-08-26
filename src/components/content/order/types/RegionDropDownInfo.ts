/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Region } from '../../../../xpanse-api/generated';

/**
 * The regions inside Area
 */
export interface RegionDropDownInfo {
    /**
     * The shown value of the region
     */
    value: string;
    /**
     * The shown label of the region
     */
    label: string;
    /**
     * The region
     */
    region: Region;
}
