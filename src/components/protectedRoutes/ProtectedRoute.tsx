/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Layout } from 'antd';
import React from 'react';
import { env } from '../../config/config.ts';
import appStyles from '../../styles/app.module.css';
import { updateApiConfig } from '../../xpanse-api/CustomOpenApiConfig';
import LayoutFooter from '../layouts/footer/LayoutFooter';
import AuthLayoutHeader from '../layouts/header/AuthLayoutHeader.tsx';
import NoAuthLayoutHeader from '../layouts/header/NoAuthLayoutHeader.tsx';
import { useCurrentUserRoleStore } from '../layouts/header/useCurrentRoleStore';
import LayoutSider from '../layouts/sider/LayoutSider';
import { roles } from '../utils/constants.tsx';
import NotAuthorized from './NotAuthorized';

interface ProtectedRouteProperties {
    children: React.JSX.Element;
    allowedRole: roles[];
}

function getFullLayout(content: React.JSX.Element): React.JSX.Element {
    return (
        <Layout className={appStyles.layout} hasSider={true}>
            <LayoutSider />
            <Layout>
                {env.VITE_APP_AUTH_DISABLED === 'true' ? <NoAuthLayoutHeader /> : <AuthLayoutHeader />}
                <Layout.Content className={appStyles.siteLayout}>
                    <div className={appStyles.siteLayoutBackground}>{content}</div>
                </Layout.Content>
                <LayoutFooter />
            </Layout>
        </Layout>
    );
}

function Protected(protectedRouteProperties: ProtectedRouteProperties): React.JSX.Element {
    if (env.VITE_APP_AUTH_DISABLED !== 'true') {
        updateApiConfig();
    }

    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    if (currentRole !== undefined && protectedRouteProperties.allowedRole.includes(currentRole as roles)) {
        return getFullLayout(protectedRouteProperties.children);
    }
    return getFullLayout(<NotAuthorized />);
}

export default Protected;
