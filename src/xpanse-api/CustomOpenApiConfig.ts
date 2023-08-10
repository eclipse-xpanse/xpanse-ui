/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OpenAPI } from './generated';
import { useOidcAccessToken } from '@axa-fr/react-oidc';
import { env } from '../config/config';
export const updateApiConfig = (): void => {
    OpenAPI.BASE = env.REACT_APP_XPANSE_API_URL ?? '';
    OpenAPI.TOKEN = useOidcAccessToken().accessToken;
};
