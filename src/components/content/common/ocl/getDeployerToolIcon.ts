/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { getCorrectedCustomBaseUrl } from '../../../utils/customBaseUrl.ts';

export const getDeployerToolIcon = (kind: string) => {
    switch (kind) {
        case 'terraform':
            return getCorrectedCustomBaseUrl() + 'terraform.svg';
        case 'opentofu':
            return getCorrectedCustomBaseUrl() + 'openTofu.png';
        default:
            return '';
    }
};
