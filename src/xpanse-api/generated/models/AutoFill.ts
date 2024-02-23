/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Variable autofill
 */
export type AutoFill = {
    /**
     * Deployed resource type
     */
    deployResourceKind: AutoFill.deployResourceKind;
    /**
     * Not whether the variable is allowed to be created
     */
    isAllowCreate: boolean;
};
export namespace AutoFill {
    /**
     * Deployed resource type
     */
    export enum deployResourceKind {
        VM = 'vm',
        CONTAINER = 'container',
        PUBLIC_IP = 'publicIP',
        VPC = 'vpc',
        VOLUME = 'volume',
        UNKNOWN = 'unknown',
        SECURITY_GROUP = 'security_group',
        SECURITY_GROUP_RULE = 'security_group_rule',
        KEYPAIR = 'keypair',
        SUBNET = 'subnet',
    }
}
