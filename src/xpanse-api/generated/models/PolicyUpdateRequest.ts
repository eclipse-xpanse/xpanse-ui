/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PolicyUpdateRequest = {
    /**
     * The id of the policy.
     */
    id: string;
    /**
     * The csp which the policy belongs to.
     */
    csp?: PolicyUpdateRequest.csp;
    /**
     * The policy.
     */
    policy?: string;
    /**
     * Is the policy enabled. true:enabled;false:disabled.
     */
    enabled?: boolean;
};

export namespace PolicyUpdateRequest {
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
