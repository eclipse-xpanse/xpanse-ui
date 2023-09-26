/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homePageRoute } from '../../utils/constants';
import { MenuInfo } from 'rc-menu/lib/interface';
import '../../../styles/layout_header_footer.css';
import { getMenuItems } from './menuItems';

function LayoutSider(): React.JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const onClicked = function (cfg: MenuInfo): void {
        navigate(cfg.key);
    };

    return (
        <Layout.Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(newValue) => {
                setCollapsed(newValue);
            }}
            className={`header-sider-class ${collapsed ? 'collapsed-sider' : ''}`}
        >
            <div className={'logo'}>
                <Link to={homePageRoute}>
                    <Image width={150} src='xpanse-black.png' preview={false} />
                </Link>
            </div>
            <Menu items={getMenuItems()} mode='inline' theme='dark' onClick={onClicked} />
        </Layout.Sider>
    );
}

export default LayoutSider;
