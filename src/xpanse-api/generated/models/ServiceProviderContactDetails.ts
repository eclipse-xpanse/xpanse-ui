/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The contact details of the service provider.
 */
export type ServiceProviderContactDetails = {
    /**
     * List of the email details of the service provider. The list elements must be unique.
     */
    emails?: Array<string>;
    /**
     * List of the phone details of the service provider. The list elements must be unique.
     */
    phones?: Array<string>;
    /**
     * List of the chat details of the service provider. The list elements must be unique.
     */
    chats?: Array<string>;
    /**
     * List of the website details of the service provider. The list elements must be unique.
     */
    websites?: Array<string>;
};
