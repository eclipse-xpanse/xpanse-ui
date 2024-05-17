/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Layout } from 'antd';
import React from 'react';
import { updateApiConfig } from '../../xpanse-api/CustomOpenApiConfig';
import LayoutFooter from '../layouts/footer/LayoutFooter';
import LayoutHeader from '../layouts/header/LayoutHeader';
import { useCurrentUserRoleStore } from '../layouts/header/useCurrentRoleStore';
import LayoutSider from '../layouts/sider/LayoutSider';
import NotAuthorized from './NotAuthorized';

interface ProtectedRouteProperties {
    children: React.JSX.Element;
    allowedRole: ('isv' | 'user' | 'admin' | 'csp')[];
}

function getFullLayout(content: React.JSX.Element): React.JSX.Element {
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

function Protected(protectedRouteProperties: ProtectedRouteProperties): React.JSX.Element {
    updateApiConfig();
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    if (
        currentRole !== undefined &&
        protectedRouteProperties.allowedRole.includes(currentRole as 'isv' | 'user' | 'admin' | 'csp')
    ) {
        return getFullLayout(protectedRouteProperties.children);
    }
    return getFullLayout(<NotAuthorized />);
}

export default Protected;
