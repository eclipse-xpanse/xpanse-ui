/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The resource list of the deployed service.
 */
export type DeployResource = {
    /**
     * The id of the deployed resource.
     */
    resourceId: string;
    /**
     * The name of the deployed resource.
     */
    name: string;
    /**
     * The kind of the deployed resource.
     */
    kind: DeployResource.kind;
    /**
     * The properties of the deployed resource.
     */
    properties: Record<string, string>;
};

export namespace DeployResource {
    /**
     * The kind of the deployed resource.
     */
    export enum kind {
        VM = 'vm',
        CONTAINER = 'container',
        PUBLIC_IP = 'publicIP',
        VPC = 'vpc',
        VOLUME = 'volume',
        UNKNOWN = 'unknown',
    }
}
