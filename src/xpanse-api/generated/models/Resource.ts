/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The resources of the flavor of the manged service.
 */
export type Resource = {
    /**
     * The count of the same resource.
     */
    count: number;
    /**
     * The kind of the same resource.
     */
    deployResourceKind: Resource.deployResourceKind;
    /**
     * The properties of the same resource.
     */
    properties?: Record<string, string>;
};
export namespace Resource {
    /**
     * The kind of the same resource.
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
