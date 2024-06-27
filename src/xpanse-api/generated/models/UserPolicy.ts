/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserPolicy = {
    /**
     * The id of the policy.
     */
    userPolicyId: string;
    /**
     * The valid policy created by the user.
     */
    policy: string;
    /**
     * The csp which the policy belongs to.
     */
    csp: UserPolicy.csp;
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
export namespace UserPolicy {
    /**
     * The csp which the policy belongs to.
     */
    export enum csp {
        HUAWEI_CLOUD = 'HuaweiCloud',
        FLEXIBLE_ENGINE = 'FlexibleEngine',
        OPENSTACK_TESTLAB = 'OpenstackTestlab',
        PLUS_SERVER = 'PlusServer',
        REGIO_CLOUD = 'RegioCloud',
        ALIBABA_CLOUD = 'AlibabaCloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE_CLOUD_PLATFORM = 'GoogleCloudPlatform',
    }
}
