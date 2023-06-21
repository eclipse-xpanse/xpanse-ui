/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Response = {
    /**
     * The result code of response.
     */
    resultType: Response.resultType;
    /**
     * Details of the errors occurred
     */
    details: Array<string>;
    /**
     * Describes if the request is successful
     */
    success: boolean;
};

export namespace Response {
    /**
     * The result code of response.
     */
    export enum resultType {
        SUCCESS = 'Success',
        RUNTIME_FAILURE = 'Runtime Failure',
        PARAMETERS_INVALID = 'Parameters Invalid',
        TERRAFORM_SCRIPT_INVALID = 'Terraform Script Invalid',
        UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
        RESPONSE_NOT_VALID = 'Response Not Valid',
        FAILURE_WHILE_CONNECTING_TO_BACKEND = 'Failure while connecting to backend',
    }
}
