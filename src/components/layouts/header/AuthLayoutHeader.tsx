/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidcIdToken } from '@axa-fr/react-oidc';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
import React from 'react';
import { getRolesOfUser, getUserName } from '../../oidc/OidcConfig.ts';
import LayoutHeader from './LayoutHeader.tsx';

function AuthLayoutHeader(): React.JSX.Element {
    const oidcIdToken: OidcIdToken = useOidcIdToken();
    return oidcIdToken.idToken ? (
        <LayoutHeader
            userName={getUserName(oidcIdToken.idTokenPayload as object)}
            roles={getRolesOfUser(oidcIdToken.idTokenPayload as object)}
        />
    ) : (
        <LayoutHeader userName={''} roles={[]} />
    );
}

export default AuthLayoutHeader;
