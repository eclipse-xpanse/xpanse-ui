/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Layout } from 'antd';
import LayoutFooter from '../layouts/footer/LayoutFooter';
import LayoutHeader from '../layouts/header/LayoutHeader';
import LayoutSider from '../layouts/sider/LayoutSider';
import NotAuthorized from './NotAuthorized';
import { updateApiConfig } from '../../xpanse-api/CustomOpenApiConfig';
import React from 'react';
import { userRoleKey } from '../utils/constants';

interface ProtectedRouteProperties {
    children: React.JSX.Element;
    allowedRole: 'isv' | 'user' | 'admin' | 'all';
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
    const currentRole: string | null = sessionStorage.getItem(userRoleKey);

    if (
        protectedRouteProperties.allowedRole === 'all' ||
        (currentRole !== null && protectedRouteProperties.allowedRole === currentRole)
    ) {
        return getFullLayout(protectedRouteProperties.children);
    }
    return getFullLayout(<NotAuthorized />);
}

export default Protected;
