/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The variables list of the credential
 */
export type CredentialVariable = {
    /**
     * The name of the CredentialVariable,this field is provided by the the plugin of cloud service provider.
     */
    name: string;
    /**
     * The description of the CredentialVariable,this field is provided by the plugin of cloud service provider.
     */
    description: string;
    /**
     * The value of the CredentialVariable, this field is filled by the user.
     */
    value: string;
    mandatory?: boolean;
    sensitive?: boolean;
};
