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
import { updateApiConfig } from '../../xpanse-api/CustomOpenApiConfig';

interface ProtectedRouteProperties {
    children: JSX.Element;
    allowedRole: 'csp' | 'user' | 'all';
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { idTokenPayload } = useOidcIdToken();

    updateApiConfig();
    const roles: string[] = getRolesOfUser(idTokenPayload as object);

    if (protectedRouteProperties.allowedRole === 'all' || roles.includes(protectedRouteProperties.allowedRole)) {
        return getFullLayout(protectedRouteProperties.children);
    }
    return getFullLayout(<NotAuthorized />);
}

export default Protected;
