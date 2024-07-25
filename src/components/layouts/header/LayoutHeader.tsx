/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useOidcIdToken } from '@axa-fr/react-oidc';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
import { Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';
import appStyles from '../../../styles/app.module.css';
import headerStyles from '../../../styles/header.module.css';
import SystemStatusBar from '../../content/systemStatus/SystemStatusBar';
import { HeaderUserRoles } from './HeaderUserRoles';
import { SearchServices } from './SearchServices.tsx';
import { useCurrentUserRoleStore } from './useCurrentRoleStore.ts';

function LayoutHeader(): React.JSX.Element {
    const oidcIdToken: OidcIdToken = useOidcIdToken();
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);
    return (
        <Header className={headerStyles.layoutHeader}>
            <div className={appStyles.headerMenu}>
                <Space align='baseline'>
                    {currentRole && currentRole === 'user' ? <SearchServices /> : <></>}
                    <SystemStatusBar />
                    {oidcIdToken.idToken ? (
                        <HeaderUserRoles oidcIdToken={oidcIdToken} key={oidcIdToken.idToken as string} />
                    ) : null}
                </Space>
            </div>
        </Header>
    );
}

export default LayoutHeader;
