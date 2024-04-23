/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserPolicyUpdateRequest = {
    /**
     * The csp which the policy belongs to.
     */
    csp?: UserPolicyUpdateRequest.csp;
    /**
     * The policy.
     */
    policy?: string;
    /**
     * Is the policy enabled. true:enabled;false:disabled.
     */
    enabled?: boolean;
};
export namespace UserPolicyUpdateRequest {
    /**
     * The csp which the policy belongs to.
     */
    export enum csp {
        HUAWEI = 'huawei',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        OPENSTACK = 'openstack',
        SCS = 'scs',
        ALICLOUD = 'alicloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE = 'google',
    }
}
