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
     * Type of the cloud resource to be reused.
     */
    deployResourceKind: AutoFill.deployResourceKind;
    /**
     *  defines if the required cloud resource can be newly created or should the existing resources must only be used.
     */
    isAllowCreate: boolean;
};
export namespace AutoFill {
    /**
     * Type of the cloud resource to be reused.
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
