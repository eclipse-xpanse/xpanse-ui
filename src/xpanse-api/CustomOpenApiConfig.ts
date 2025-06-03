/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidcAccessToken } from '@axa-fr/react-oidc';
import { env } from '../config/config';
import { OpenAPI } from './generated';
import { timezoneInterceptor } from './timezone.ts';

export const updateApiConfig = (): void => {
    OpenAPI.BASE = env.VITE_APP_XPANSE_API_URL ?? '';
    // when service worker enabled, the access token is automatically injected by the oidc-react library.
    OpenAPI.TOKEN = env.VITE_APP_AUTH_USE_SERVICE_WORKER_ONLY !== 'true' ? useOidcAccessToken().accessToken : undefined;
    // add timezone interceptor.
    OpenAPI.interceptors.response.use(timezoneInterceptor);
};
