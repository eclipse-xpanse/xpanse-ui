/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CredentialVariable } from './CredentialVariable';

export type CreateCredential = {
    /**
     * The name of the credential
     */
    name: string;
    /**
     * User who create the credential.
     */
    userName: string;
    /**
     * The cloud service provider of the credential.
     */
    csp: CreateCredential.csp;
    /**
     * The description of the credential
     */
    description?: string;
    /**
     * The type of the credential
     */
    type: CreateCredential.type;
    /**
     * The variables list of the credential
     */
    variables: Array<CredentialVariable>;
    /**
     * The time in seconds to live of the credential
     */
    timeToLive: number;
};

export namespace CreateCredential {
    /**
     * The cloud service provider of the credential.
     */
    export enum csp {
        AWS = 'aws',
        AZURE = 'azure',
        ALICLOUD = 'alicloud',
        HUAWEI = 'huawei',
        OPENSTACK = 'openstack',
        FLEXIBLE_ENGINE = 'flexibleEngine',
    }

    /**
     * The type of the credential
     */
    export enum type {
        VARIABLES = 'variables',
        HTTP_AUTHENTICATION = 'http_authentication',
        API_KEY = 'api_key',
        OAUTH2 = 'oauth2',
    }
}
