/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ServicePolicyUpdateRequest = {
    /**
     * The id of the policy.
     */
    id: string;
    /**
     * The flavor name list which the policy belongs to. If the list is empty, then the policy will be executed for during service deployment of all flavors.
     */
    flavorNameList?: Array<string>;
    /**
     * The policy.
     */
    policy?: string;
    /**
     * Is the policy enabled. true:enabled;false:disabled.
     */
    enabled?: boolean;
};
