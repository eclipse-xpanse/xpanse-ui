/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServicePolicy, ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';

export type ServicePolicyUploadFileStatus = 'notStarted' | 'inProgress' | 'completed' | 'error';
export const servicePoliciesStatuses: boolean[] = [true, false];

export const flavorNameList = (serviceDetails: ServiceTemplateDetailVo): string[] => {
    const flavorNameList: string[] = [];

    serviceDetails.flavors.serviceFlavors.forEach((flavorItem) => {
        flavorNameList.push(flavorItem.name);
    });
    return flavorNameList;
};

const isArrraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) {
        return false;
    }

    for (const item of a) {
        if (!b.includes(item)) {
            return false;
        }
    }

    return true;
};

export const comparePolicyUpdateRequestResult = (
    policyRequest: {
        enabled: boolean;
        policy: string;
        flavors: string[];
    },
    currentServicePolicy: ServicePolicy | undefined
): boolean => {
    if (currentServicePolicy === undefined) {
        return false;
    }
    if (
        currentServicePolicy.enabled === policyRequest.enabled &&
        currentServicePolicy.policy === policyRequest.policy &&
        currentServicePolicy.flavorNameList &&
        currentServicePolicy.flavorNameList.length > 0 &&
        policyRequest.flavors.length > 0 &&
        isArrraysEqual(currentServicePolicy.flavorNameList, policyRequest.flavors)
    ) {
        return true;
    }
    return false;
};
