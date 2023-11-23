/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Policy = {
    /**
     * The id of the policy.
     */
    id: string;
    /**
     * The valid policy created by the user.
     */
    policy: string;
    /**
     * The csp which the policy belongs to.
     */
    csp: Policy.csp;
    /**
     * Is the policy enabled.
     */
    enabled: boolean;
    /**
     * Time of the policy created.
     */
    createTime: string;
    /**
     * Time of the policy updated.
     */
    lastModifiedTime: string;
};

export namespace Policy {
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
