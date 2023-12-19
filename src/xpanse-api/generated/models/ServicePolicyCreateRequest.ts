/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ServicePolicyCreateRequest = {
    /**
     * The id of registered service template which the policy belongs to.
     */
    serviceTemplateId: string;
    /**
     * The policy.
     */
    policy: string;
    /**
     * Is the policy enabled. true:enabled;false:disabled.
     */
    enabled: boolean;
};
