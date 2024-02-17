/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import SystemStatusBar from '../../content/systemStatus/SystemStatusBar';
import { HeaderUserRoles } from './HeaderUserRoles';
import React from 'react';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
import { useOidcIdToken } from '@axa-fr/react-oidc';

function LayoutHeader(): React.JSX.Element {
    const oidcIdToken: OidcIdToken = useOidcIdToken();
    return (
        <Header style={{ width: '100%', background: '#ffffff' }}>
            <div className={'header-menu'}>
                <Space align='baseline'>
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
