/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OpenAPI } from './generated';
import { useOidcAccessToken } from '@axa-fr/react-oidc';
export const updateApiConfig = (): void => {
    OpenAPI.BASE = process.env.REACT_APP_XPANSE_API_URL as string;
    OpenAPI.TOKEN = useOidcAccessToken().accessToken;
};
