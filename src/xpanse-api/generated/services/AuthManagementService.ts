/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { TokenResponse } from '../models/TokenResponse';
export class AuthManagementService {
    /**
     * Get token info by authorization code.
     * @param code The authorization code.
     * @param state Opaque value used to maintain state.
     * @returns TokenResponse OK
     * @throws ApiError
     */
    public static getAccessToken(code: string, state: string): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/token',
            query: {
                code: code,
                state: state,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
    /**
     * Get and redirect authorization url for user to authenticate.
     * @returns any OK
     * @throws ApiError
     */
    public static authorize(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/authorize',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
}
