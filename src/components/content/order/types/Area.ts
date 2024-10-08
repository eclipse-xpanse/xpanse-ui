/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Region } from '../../../../xpanse-api/generated';

/**
 * The area of the regions
 */
export interface Area {
    /**
     * The name of the area
     */
    name: string;
    /**
     * The regions of the area
     */
    regions: Region[];
}
