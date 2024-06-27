/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserPolicyCreateRequest = {
    /**
     * The csp which the policy belongs to.
     */
    csp: UserPolicyCreateRequest.csp;
    /**
     * The policy.
     */
    policy: string;
    /**
     * Is the policy enabled. true:enabled;false:disabled.
     */
    enabled: boolean;
};
export namespace UserPolicyCreateRequest {
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
