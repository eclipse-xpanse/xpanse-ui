/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type WorkFlowTask = {
    /**
     * The id of the ProcessInstance
     */
    processInstanceId: string;
    /**
     * The name of the ProcessInstance
     */
    processInstanceName?: string;
    /**
     * The id of the ProcessDefinition
     */
    processDefinitionId: string;
    /**
     * The name of the ProcessDefinition
     */
    processDefinitionName: string;
    /**
     * The execution id of the ProcessInstance
     */
    executionId: string;
    /**
     * The id of the task
     */
    taskId: string;
    /**
     * The name of the task
     */
    taskName: string;
    /**
     * The businessKey of the Process
     */
    businessKey: string;
    /**
     * The create time of the task
     */
    createTime: string;
};
