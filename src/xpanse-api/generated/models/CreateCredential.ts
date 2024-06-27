/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
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
     * The variables list of the credential. The list elements must be unique.
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
     * The type of the credential
     */
    export enum type {
        VARIABLES = 'variables',
        HTTP_AUTHENTICATION = 'http_authentication',
        API_KEY = 'api_key',
        OAUTH2 = 'oauth2',
    }
}
