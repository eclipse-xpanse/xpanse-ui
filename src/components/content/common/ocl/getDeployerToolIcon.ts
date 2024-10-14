/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export const getDeployerToolIcon = (kind: string) => {
    switch (kind) {
        case 'terraform':
            return '/terraform.svg';
        case 'opentofu':
            return '/openTofu.png';
        default:
            return '';
    }
};
