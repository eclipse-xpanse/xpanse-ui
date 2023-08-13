/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { env } from '../../config/config';
import { OidcConfiguration } from '@axa-fr/react-oidc';

export const allowRoleList: string[] = ['isv', 'user', 'admin'];

export const OidcConfig: OidcConfiguration = {
    authority: env.REACT_APP_ZITADEL_AUTHORITY_NAME ?? '',
    client_id: env.REACT_APP_ZITADEL_CLIENT_ID ?? '',
    redirect_uri: window.location.origin + (env.REACT_APP_ZITADEL_REDIRECT_URI ?? ''),
    silent_redirect_uri: window.location.origin + (env.REACT_APP_ZITADEL_SILENT_REDIRECT_URI ?? ''),
    scope: env.REACT_APP_ZITADEL_SCOPE ?? '',
    service_worker_only: false,
};

export function getRolesOfUser(oidcUserInfo: object): string[] {
    let availableRoleList: string[] = [];
    if ('urn:zitadel:iam:org:project:roles' in oidcUserInfo) {
        if (
            typeof oidcUserInfo['urn:zitadel:iam:org:project:roles'] === 'object' &&
            oidcUserInfo['urn:zitadel:iam:org:project:roles'] !== null
        ) {
            const roleList: string[] = Object.keys(oidcUserInfo['urn:zitadel:iam:org:project:roles']);
            availableRoleList = roleList.filter((element) => {
                return allowRoleList.includes(element);
            });
        }
    }

    if (availableRoleList.length === 0) {
        availableRoleList.push('user'); // default role when no roles are assigned.
    }
    return availableRoleList;
}

export function getUserName(oidcUserInfo: object): string {
    if ('name' in oidcUserInfo) {
        if (typeof oidcUserInfo.name === 'string') {
            return oidcUserInfo.name;
        }
    }
    return '';
}
