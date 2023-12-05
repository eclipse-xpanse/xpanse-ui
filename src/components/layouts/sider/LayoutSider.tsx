/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { catalogPageRoute, homePageRoute, servicesPageRoute } from '../../utils/constants';
import { MenuInfo } from 'rc-menu/lib/interface';
import { getMenuItems } from './menuItems';

function LayoutSider(): React.JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const [isBroken, setIsBroken] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, hash } = location;

    const onClicked = function (cfg: MenuInfo): void {
        navigate(cfg.key);
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
            <div className={'logo'}>
                <Link to={homePageRoute}>
                    <Image
                        width={collapsed ? 30 : 150}
                        src={collapsed ? 'xpanse-black-logo-only.png' : 'xpanse-black.png'}
                        preview={false}
                    />
                </Link>
            </div>
            <Menu
                items={getMenuItems()}
                mode='inline'
                theme='dark'
                onClick={onClicked}
                selectedKeys={getSelectedKey()}
            />
        </Layout.Sider>
    );
}

export default LayoutSider;
