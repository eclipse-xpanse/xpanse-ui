/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TerraformResult = {
    destroyScenario?: TerraformResult.destroyScenario;
    commandStdOutput?: string;
    commandStdError?: string;
    terraformState?: string;
    importantFileContentMap?: Record<string, string>;
    commandSuccessful?: boolean;
};
export namespace TerraformResult {
    export enum destroyScenario {
        DESTROY = 'destroy',
        ROLLBACK = 'rollback',
        PURGE = 'purge',
    }
}
