/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeployVariableKind } from './DeployVariableKind';

/**
 * The variables for the deployment, which will be passed to the deployer
 */
export type DeployVariable = {
    /**
     * The name of the deploy variable
     */
    name: string;
    kind: DeployVariableKind;
    /**
     * The type of the deploy variable
     */
    dataType: DeployVariable.dataType;
    /**
     * The example value of the deploy variable
     */
    example?: string;
    /**
     * The description of the deploy variable
     */
    description: string;
    /**
     * The value of the deploy variable. Value can be provided for default variables
     */
    value?: string;
    /**
     * Indicates if the variable is mandatory
     */
    mandatory: boolean;
    /**
     * valueSchema of the variable. The key be any keyword that is part of the JSON schema definition which can be found here https://json-schema.org/draft/2020-12/schema
     */
    valueSchema?: Record<string, any>;
    /**
     * Sensitive scope of variable storage
     */
    sensitiveScope?: DeployVariable.sensitiveScope;
};

export namespace DeployVariable {
    /**
     * The type of the deploy variable
     */
    export enum dataType {
        STRING = 'string',
        NUMBER = 'number',
        BOOLEAN = 'boolean',
    }

    /**
     * Sensitive scope of variable storage
     */
    export enum sensitiveScope {
        NONE = 'none',
        ONCE = 'once',
        ALWAYS = 'always',
    }
}
