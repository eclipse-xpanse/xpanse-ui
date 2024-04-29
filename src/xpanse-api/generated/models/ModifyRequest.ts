/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ModifyRequest = {
    /**
     * Customer's name for the service. Used only for customer's reference. If not provided, the existing customerServiceName from the service will be reused.
     */
    customerServiceName?: string;
    /**
     * The flavor of the Service.
     */
    flavor?: string;
    /**
     * The properties for the requested service
     */
    serviceRequestProperties?: Record<string, any>;
};
