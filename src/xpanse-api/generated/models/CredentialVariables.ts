/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CredentialVariable } from './CredentialVariable';

export type CredentialVariables = {
    /**
     * The cloud service provider of the credential.
     */
    csp: CredentialVariables.csp;
    /**
     * The type of the credential,this field is provided by  he the plugin of cloud service provider.
     */
    type: CredentialVariables.type;
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
    /**
     * The variables list of the credential.
     */
    variables: Array<CredentialVariable>;
};

export namespace CredentialVariables {
    /**
     * The cloud service provider of the credential.
     */
    export enum csp {
        HUAWEI = 'huawei',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        OPENSTACK = 'openstack',
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
