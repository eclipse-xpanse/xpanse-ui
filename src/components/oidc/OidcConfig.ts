/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OidcConfiguration } from '@axa-fr/react-oidc';
import { env } from '../../config/config';
import { getCorrectedCustomBaseUrl } from '../utils/customBaseUrl.ts';
import { defaultRole, grantedRolesKey, usernameKey } from './OidcUserInfo';

export const allowRoleList: string[] = ['isv', 'user', 'admin', 'csp'];

export const OidcConfig: OidcConfiguration = {
    authority: env.VITE_APP_ZITADEL_AUTHORITY_URL ?? '',
    client_id: env.VITE_APP_ZITADEL_CLIENT_ID ?? '',
    redirect_uri: window.location.origin + (env.VITE_APP_ZITADEL_REDIRECT_URI ?? ''),
    silent_redirect_uri: window.location.origin + (env.VITE_APP_ZITADEL_SILENT_REDIRECT_URI ?? ''),
    scope: env.VITE_APP_ZITADEL_SCOPE ?? '',
    service_worker_relative_url: getCorrectedCustomBaseUrl() + 'OidcServiceWorker.js',
    service_worker_only: env.VITE_APP_AUTH_USE_SERVICE_WORKER_ONLY === 'true',
    service_worker_activate: () => env.VITE_APP_AUTH_USE_SERVICE_WORKER_ONLY === 'true',
};

export function getRolesOfUser(oidcUserInfo: object): string[] {
    let availableRoleList: string[] = [];
    if (grantedRolesKey in oidcUserInfo) {
        const grantedRolesObject = oidcUserInfo[grantedRolesKey];
        if (typeof grantedRolesObject === 'object' && grantedRolesObject !== null) {
            const roleList: string[] = Object.keys(grantedRolesObject);
            availableRoleList = roleList.filter((element) => {
                return allowRoleList.includes(element);
            });
        }
    }

    if (availableRoleList.length === 0) {
        availableRoleList.push(defaultRole); // default role when no roles are assigned.
    }
    return availableRoleList;
}

export function getUserName(oidcUserInfo: object): string {
    if (usernameKey in oidcUserInfo) {
        if (typeof oidcUserInfo.name === 'string') {
            return oidcUserInfo.name;
        }
    }
    return '';
}
