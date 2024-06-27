/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
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
     * The type of the credential, this field is provided by the plugin of cloud service provider.
     */
    type?: AbstractCredentialInfo.type;
    /**
     * The name of the credential, this field is provided by the plugin of cloud service provider. The value of this field must be unique between credentials with the same csp and type.
     */
    name?: string;
    /**
     * The description of the credential,this field is provided by the plugin of cloud service provider.
     */
    description?: string;
    /**
     * The id of user who created the credential.
     */
    userId?: string;
} & {
    /**
     * The cloud service provider of the credential.
     */
    csp: AbstractCredentialInfo.csp;
    /**
     * The type of the credential, this field is provided by the plugin of cloud service provider.
     */
    type: AbstractCredentialInfo.type;
    /**
     * The name of the credential, this field is provided by the plugin of cloud service provider. The value of this field must be unique between credentials with the same csp and type.
     */
    name: string;
    /**
     * The description of the credential,this field is provided by the plugin of cloud service provider.
     */
    description: string;
};
export namespace AbstractCredentialInfo {
    /**
     * The cloud service provider of the credential.
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
    /**
     * The type of the credential, this field is provided by the plugin of cloud service provider.
     */
    export enum type {
        VARIABLES = 'variables',
        HTTP_AUTHENTICATION = 'http_authentication',
        API_KEY = 'api_key',
        OAUTH2 = 'oauth2',
    }
}
