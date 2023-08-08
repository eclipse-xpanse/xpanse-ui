/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OidcConfiguration } from '@axa-fr/react-oidc/dist/vanilla';

export const onEvent = (configurationName: string, eventName: string, data: object) => {
    console.log(`oidc:${configurationName}:${eventName}`, data);
};

export const allowRoleList: string[] = ['csp', 'user', 'admin'];

export const OidcConfig: OidcConfiguration = {
    /*eslint-disable  @typescript-eslint/no-non-null-assertion */
    authority: process.env.REACT_APP_ZITADEL_AUTHORITY_NAME!,
    client_id: process.env.REACT_APP_ZITADEL_CLIENT_ID!,
    redirect_uri: window.location.origin + process.env.REACT_APP_ZITADEL_REDIRECT_URI!,
    silent_redirect_uri: window.location.origin + process.env.REACT_APP_ZITADEL_SILENT_REDIRECT_URI!,
    scope: process.env.REACT_APP_ZITADEL_SCOPE!,
    service_worker_only: false,
    /*eslint-enable  @typescript-eslint/no-non-null-assertion */
};

export function getRolesOfUser(oidcUserInfo: object): string[] {
    if ('urn:zitadel:iam:org:project:roles' in oidcUserInfo) {
        if (
            typeof oidcUserInfo['urn:zitadel:iam:org:project:roles'] === 'object' &&
            oidcUserInfo['urn:zitadel:iam:org:project:roles'] !== null
        ) {
            return Object.keys(oidcUserInfo['urn:zitadel:iam:org:project:roles']);
        }
    }
    return ['user']; //default role when no roles are assigned.
}

export function getUserName(oidcUserInfo: object): string {
    if ('name' in oidcUserInfo) {
        if (typeof oidcUserInfo.name === 'string') {
            return oidcUserInfo.name;
        }
    }
    return '';
}

export function getUserId(oidcUserInfo: object): string {
    if ('sub' in oidcUserInfo) {
        if (typeof oidcUserInfo.sub === 'string') {
            return oidcUserInfo.sub;
        }
    }
    return '';
}
