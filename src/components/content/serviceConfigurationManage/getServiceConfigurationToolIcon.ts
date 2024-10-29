/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */
export const getServiceConfigurationToolIcon = (type: string) => {
    switch (type) {
        case 'ansible':
            return '/ansible_logo.png';
        default:
            return '';
    }
};
