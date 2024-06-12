/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The variables list of the credential. The list elements must be unique.
 */
export type CredentialVariable = {
    /**
     * The name of the CredentialVariable,this field is provided by the plugin of cloud service provider.
     */
    name: string;
    /**
     * The description of the CredentialVariable,this field is provided by the plugin of cloud service provider.
     */
    description: string;
    /**
     * If the variable is mandatory. If is optional then the credential completeness check will ignore this variable. It is upto the plugin to decide what needs to be done if this optional credential variable is present.
     */
    isMandatory?: boolean;
    /**
     * Defines if the particular variable contains sensitive data. For example the value is false for username and true for password variables respectively.
     */
    isSensitive: boolean;
    /**
     * The value of the CredentialVariable, this field is filled by the user.
     */
    value: string;
};
