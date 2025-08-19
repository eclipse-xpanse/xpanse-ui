/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidcAccessToken } from '@axa-fr/react-oidc';
import { env } from '../config/config';
import { ApiError, NetworkError } from './error.ts';
import { client } from './generated/client.gen.ts';
import { timezoneInterceptor } from './timezone.ts';

// api-fetch-wrapper.ts
export const apiFetchWrapper: typeof fetch = async (input, init) => {
    let res: Response;
    try {
        res = await fetch(input, init);
    } catch (e: any) {
        // This is a network-level error
        throw new NetworkError(e?.message || ' Network request failed');
    }

    if (!res.ok) {
        let body: any;
        try {
            body = await res.clone().json();
        } catch {
            body = await res.text();
        }
        throw new ApiError(res.status, body?.message || res.statusText || 'API Error', body);
    }

    return res;
};

export const updateApiConfig = (): void => {
    client.setConfig({
        baseUrl: env.VITE_APP_XPANSE_API_URL ?? '',
        fetch: apiFetchWrapper,
        auth:
            env.VITE_APP_AUTH_DISABLED !== 'true'
                ? env.VITE_APP_AUTH_USE_SERVICE_WORKER_ONLY !== 'true'
                    ? useOidcAccessToken().accessToken
                    : undefined
                : undefined,
    });
    // when service worker enabled, the access token is automatically injected by the oidc-react library.
    // add timezone interceptor.
    client.interceptors.response.use(timezoneInterceptor);
};
