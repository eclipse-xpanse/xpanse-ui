/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image, Layout, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import appStyles from '../../../styles/app.module.css';
import { catalogPageRoute, homePageRoute, servicesPageRoute } from '../../utils/constants';
import { useCurrentUserRoleStore } from '../header/useCurrentRoleStore.ts';
import { getMenuItems } from './menuItems';

function LayoutSider(): React.JSX.Element {
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    const [collapsed, setCollapsed] = useState(false);
    const [isBroken, setIsBroken] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, hash } = location;

    const onClicked = function (cfg: MenuInfo): void {
        void navigate(cfg.key);
    };

    function getSelectedKey(): string[] {
        if (pathname.startsWith(servicesPageRoute) && hash) {
            return [servicesPageRoute + hash];
        }
        if (pathname.startsWith(catalogPageRoute) && hash) {
            return [catalogPageRoute + hash];
        }
        return [pathname];
    }

    // necessary to open collapsed menu item when user directly opens a specific sub-page link
    function getDefaultOpenKey(): string[] {
        if (pathname.startsWith(servicesPageRoute) && hash) {
            return [servicesPageRoute];
        }
        if (pathname.startsWith(catalogPageRoute) && hash) {
            return [catalogPageRoute];
        }
        return [];
    }

    return (
        <Layout.Sider
            collapsible={!isBroken}
            collapsed={collapsed}
            onCollapse={(newValue) => {
                setCollapsed(newValue);
            }}
            breakpoint={'md'}
            onBreakpoint={(broken) => {
                setIsBroken(broken);
            }}
        >
            <div className={appStyles.logo}>
                <Link to={homePageRoute}>
                    <Image
                        width={collapsed ? 30 : 150}
                        src={collapsed ? '/xpanse-black-logo-only.png' : '/xpanse-black.png'}
                        preview={false}
                    />
                </Link>
            </div>
            <Menu
                items={getMenuItems(currentRole ?? '')}
                mode='inline'
                theme='dark'
                onClick={onClicked}
                selectedKeys={getSelectedKey()}
                defaultOpenKeys={getDefaultOpenKey()}
            />
        </Layout.Sider>
    );
}

export default LayoutSider;
