/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Category } from '../../../../xpanse-api/generated';

export interface UserServiceLatestVersionDisplayType {
    name: string;
    content: string;
    icon: string;
    latestVersion: string;
    category: Category;
    serviceVendor: string;
}
