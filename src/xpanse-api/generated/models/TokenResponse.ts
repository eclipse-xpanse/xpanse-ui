/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TokenResponse = {
    /**
     * An access_token as a JWT or opaque token.
     */
    access_token: string;
    /**
     * Type of the access_token.
     */
    token_type: string;
    /**
     * Number of second until the expiration of the access_token
     */
    expires_in: string;
    /**
     * An id_token of the authorized service user
     */
    id_token: string;
    /**
     * Scopes of the access_token.
     */
    scopes?: string;
};
