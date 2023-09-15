/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CredentialVariables } from './CredentialVariables';

export type AbstractCredentialInfo = CredentialVariables & {
    /**
     * The cloud service provider of the credential.
     */
    csp?: AbstractCredentialInfo.csp;
    /**
     * The type of the credential,this field is provided by  he the plugin of cloud service provider.
     */
    type?: AbstractCredentialInfo.type;
    /**
     * The name of the credential, this field is provided by the plugin of cloud service provider. The value of this field must be unique between credentials with the same csp and type.
     */
    name?: string;
    /**
     * The description of the credential,this field is provided by  he the plugin of cloud service provider.
     */
    description?: string;
    /**
     * The id of user who create the credential.
     */
    userId?: string;
} & {
    /**
     * The cloud service provider of the credential.
     */
    csp: AbstractCredentialInfo.csp;
    /**
     * The type of the credential,this field is provided by  he the plugin of cloud service provider.
     */
    type: AbstractCredentialInfo.type;
    /**
     * The name of the credential, this field is provided by the plugin of cloud service provider. The value of this field must be unique between credentials with the same csp and type.
     */
    name: string;
    /**
     * The description of the credential,this field is provided by  he the plugin of cloud service provider.
     */
    description: string;
    /**
     * The id of user who create the credential.
     */
    userId: string;
};

export namespace AbstractCredentialInfo {
    /**
     * The cloud service provider of the credential.
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

    /**
     * The type of the credential,this field is provided by  he the plugin of cloud service provider.
     */
    export enum type {
        VARIABLES = 'variables',
        HTTP_AUTHENTICATION = 'http_authentication',
        API_KEY = 'api_key',
        OAUTH2 = 'oauth2',
    }
}
