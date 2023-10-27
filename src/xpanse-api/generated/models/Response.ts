/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
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
        RUNTIME_ERROR = 'Runtime Error',
        PARAMETERS_INVALID = 'Parameters Invalid',
        TERRAFORM_SCRIPT_INVALID = 'Terraform Script Invalid',
        UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
        RESPONSE_NOT_VALID = 'Response Not Valid',
        FAILURE_WHILE_CONNECTING_TO_BACKEND = 'Failure while connecting to backend',
        CREDENTIAL_CAPABILITY_NOT_FOUND = 'Credential Capability Not Found',
        CREDENTIALS_NOT_FOUND = 'Credentials Not Found',
        CREDENTIAL_VARIABLES_NOT_COMPLETE = 'Credential Variables Not Complete',
        FLAVOR_INVALID = 'Flavor Invalid',
        TERRAFORM_EXECUTION_FAILED = 'Terraform Execution Failed',
        PLUGIN_NOT_FOUND = 'Plugin Not Found',
        DEPLOYER_NOT_FOUND = 'Deployer Not Found',
        TERRAFORM_PROVIDER_NOT_FOUND = 'Terraform Provider Not Found',
        NO_CREDENTIAL_DEFINITION_AVAILABLE = 'No Credential Definition Available',
        INVALID_SERVICE_STATE = 'Invalid Service State',
        RESOURCE_INVALID_FOR_MONITORING = 'Resource Invalid For Monitoring',
        UNHANDLED_EXCEPTION = 'Unhandled Exception',
        SERVICE_TEMPLATE_ALREADY_REGISTERED = 'Service Template Already Registered',
        ICON_PROCESSING_FAILED = 'Icon Processing Failed',
        SERVICE_TEMPLATE_NOT_REGISTERED = 'Service Template Not Registered',
        SERVICE_DEPLOYMENT_NOT_FOUND = 'Service Deployment Not Found',
        RESOURCE_NOT_FOUND = 'Resource Not Found',
        DEPLOYMENT_VARIABLE_INVALID = 'Deployment Variable Invalid',
        SERVICE_TEMPLATE_UPDATE_NOT_ALLOWED = 'Service Template Update Not Allowed',
        UNAUTHORIZED = 'Unauthorized',
        ACCESS_DENIED = 'Access Denied',
        SENSITIVE_FIELD_ENCRYPTION_OR_DECRYPTION_FAILED_EXCEPTION = 'Sensitive Field Encryption Or Decryption Failed Exception',
        UNSUPPORTED_ENUM_VALUE = 'Unsupported Enum Value',
        TERRAFORM_BOOT_REQUEST_FAILED = 'Terraform Boot Request Failed',
        METRICS_DATA_NOT_READY = 'Metrics Data Not Ready',
        VARIABLE_VALIDATION_FAILED = 'Variable Validation Failed',
        VARIABLE_SCHEMA_DEFINITION_INVALID = 'Variable Schema Definition Invalid',
    }
}
