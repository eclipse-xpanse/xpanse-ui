/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
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
        NO_CREDENTIAL_DEFINITION_AVAILABLE = 'No Credential Definition Available',
        INVALID_SERVICE_STATE = 'Invalid Service State',
        RESOURCE_INVALID_FOR_MONITORING = 'Resource Invalid For Monitoring',
        UNHANDLED_EXCEPTION = 'Unhandled Exception',
        SERVICE_TEMPLATE_ALREADY_REGISTERED = 'Service Template Already Registered',
        ICON_PROCESSING_FAILED = 'Icon Processing Failed',
        SERVICE_TEMPLATE_NOT_REGISTERED = 'Service Template Not Registered',
        SERVICE_TEMPLATE_NOT_APPROVED = 'Service Template Not Approved',
        SERVICE_TEMPLATE_ALREADY_REVIEWED = 'Service Template Already Reviewed',
        INVALID_SERVICE_VERSION = 'Invalid Service Version',
        SERVICE_DEPLOYMENT_NOT_FOUND = 'Service Deployment Not Found',
        RESOURCE_NOT_FOUND = 'Resource Not Found',
        DEPLOYMENT_VARIABLE_INVALID = 'Deployment Variable Invalid',
        SERVICE_TEMPLATE_UPDATE_NOT_ALLOWED = 'Service Template Update Not Allowed',
        UNAUTHORIZED = 'Unauthorized',
        ACCESS_DENIED = 'Access Denied',
        SENSITIVE_FIELD_ENCRYPTION_OR_DECRYPTION_FAILED_EXCEPTION = 'Sensitive Field Encryption Or Decryption Failed Exception',
        UNSUPPORTED_ENUM_VALUE = 'Unsupported Enum Value',
        TERRAFORM_BOOT_REQUEST_FAILED = 'Terraform Boot Request Failed',
        TOFU_MAKER_REQUEST_FAILED = 'Tofu Maker Request Failed',
        METRICS_DATA_NOT_READY = 'Metrics Data Not Ready',
        VARIABLE_VALIDATION_FAILED = 'Variable Validation Failed',
        VARIABLE_SCHEMA_DEFINITION_INVALID = 'Variable Schema Definition Invalid',
        POLICY_NOT_FOUND = 'Policy Not Found',
        DUPLICATE_POLICY = 'Duplicate Policy',
        POLICY_VALIDATION_FAILED = 'Policy Validation Failed',
        POLICY_EVALUATION_FAILED = 'Policy Evaluation Failed',
        CURRENT_LOGIN_USER_NO_FOUND = 'Current Login User No Found',
        SERVICE_DETAILS_NO_ACCESSIBLE = 'Service Details No Accessible',
        MIGRATING_ACTIVITI_TASK_NOT_FOUND = 'Migrating activiti Task Not Found',
        SERVICE_MIGRATION_FAILED_EXCEPTION = 'Service Migration Failed Exception',
        SERVICE_MIGRATION_NOT_FOUND = 'Service Migration Not Found',
        SERVICE_LOCKED = 'Service Locked',
        EULA_NOT_ACCEPTED = 'Eula not accepted',
        INVALID_GIT_REPO_DETAILS = 'Invalid Git Repo Details',
    }
}
