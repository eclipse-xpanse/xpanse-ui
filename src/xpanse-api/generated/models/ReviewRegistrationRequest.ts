/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewRegistrationRequest = {
    /**
     * The result of review registration.
     */
    reviewResult: ReviewRegistrationRequest.reviewResult;
    /**
     * The comment of review registration.
     */
    reviewComment?: string;
};
export namespace ReviewRegistrationRequest {
    /**
     * The result of review registration.
     */
    export enum reviewResult {
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}
