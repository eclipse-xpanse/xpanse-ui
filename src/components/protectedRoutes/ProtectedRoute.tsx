/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import LayoutFooter from '../layouts/footer/LayoutFooter';
import LayoutHeader from '../layouts/header/LayoutHeader';
import LayoutSider from '../layouts/sider/LayoutSider';
import { isAuthenticatedKey, loginPageRoute, usernameKey } from '../utils/constants';
import NotAuthorized from './NotAuthorized';

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
    const location = useLocation();
    if (
        !localStorage.getItem(isAuthenticatedKey) ||
        localStorage.getItem(isAuthenticatedKey)?.toLowerCase() === 'false'
    ) {
        return <Navigate to={loginPageRoute} replace={true} state={{ from: location }} />;
    }
    if (
        localStorage.getItem(usernameKey) !== protectedRouteProperties.allowedRole &&
        protectedRouteProperties.allowedRole !== 'all'
    ) {
        return getFullLayout(<NotAuthorized />);
    }
    return getFullLayout(protectedRouteProperties.children);
}

export default Protected;
