/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Image, Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homePageRoute, userRoleKey } from '../../utils/constants';
import registerPanelMenu from '../../content/register/registerPanelMenu';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { catalogMenu } from '../../content/catalog/services/catalogMenu';
import {
    credentialMenu,
    healthCheckMenu,
    monitorMenu,
    serviceListMenu,
    servicesMenu,
} from '../../content/order/ServicesMenu';
import { MenuInfo } from 'rc-menu/lib/interface';
import MenuLoading from './MenuLoading';
import { RegisteredServiceVo } from '../../../xpanse-api/generated';

function LayoutSider(): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState<ItemType[]>([MenuLoading()]);
    const navigate = useNavigate();

    const onClicked = function (cfg: MenuInfo): void {
        navigate(cfg.key);
    };

    const serviceCategories: string[] = Object.values(RegisteredServiceVo.category).filter((v) => isNaN(Number(v)));

    useEffect(() => {
        if (sessionStorage.getItem(userRoleKey) === 'csp') {
            setItems([catalogMenu(serviceCategories), registerPanelMenu()]);
        } else if (sessionStorage.getItem(userRoleKey) === 'admin') {
            setItems([healthCheckMenu()]);
        } else {
            setItems([servicesMenu(serviceCategories), serviceListMenu(), monitorMenu(), credentialMenu()]);
        }
    }, [serviceCategories]);

    return (
        <Layout.Sider collapsible collapsed={collapsed} onCollapse={(newValue) => setCollapsed(newValue)}>
            <div className={'logo'}>
                <Link to={homePageRoute}>
                    <Image width={150} src='xpanse-black.png' preview={false} />
                </Link>
            </div>
            <Menu items={items} mode='inline' theme='dark' onClick={onClicked} />
        </Layout.Sider>
    );
}

export default LayoutSider;
