/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Layout } from 'antd';
import LayoutFooter from '../layouts/footer/LayoutFooter';
import LayoutHeader from '../layouts/header/LayoutHeader';
import LayoutSider from '../layouts/sider/LayoutSider';
import NotAuthorized from './NotAuthorized';
import { useOidcIdToken } from '@axa-fr/react-oidc';
import { getRolesOfUser } from '../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
import { updateApiConfig } from '../../xpanse-api/CustomOpenApiConfig';

interface ProtectedRouteProperties {
    children: JSX.Element;
    allowedRole: 'isv' | 'user' | 'admin' | 'all';
}

function getFullLayout(content: JSX.Element): JSX.Element {
    return (
        <Layout className={'layout'} hasSider={true}>
            <LayoutSider />
            <Layout>
                <LayoutHeader />
                <Layout.Content className={'site-layout'}>
                    <div className={'site-layout-background'}>{content}</div>
                </Layout.Content>
                <LayoutFooter />
            </Layout>
        </Layout>
    );
}

function Protected(protectedRouteProperties: ProtectedRouteProperties): JSX.Element {
    const oidcIdToken: OidcIdToken = useOidcIdToken();

    const roles: string[] = getRolesOfUser(oidcIdToken.idTokenPayload as object);
    updateApiConfig();

    if (protectedRouteProperties.allowedRole === 'all' || roles.includes(protectedRouteProperties.allowedRole)) {
        return getFullLayout(protectedRouteProperties.children);
    }
    return getFullLayout(<NotAuthorized />);
}

export default Protected;
