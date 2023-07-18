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
import { credentialMenu, monitorMenu, serviceListMenu, servicesMenu } from '../../content/order/ServicesMenu';
import { MenuInfo } from 'rc-menu/lib/interface';
import MenuLoading from './MenuLoading';
import { ServiceVendorService } from '../../../xpanse-api/generated';

function LayoutSider(): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState<ItemType[]>([MenuLoading()]);
    const navigate = useNavigate();

    const onClicked = function (cfg: MenuInfo): void {
        navigate(cfg.key);
    };

    useEffect(() => {
        if (sessionStorage.getItem(userRoleKey) === 'csp') {
            ServiceVendorService.listCategories()
                .then((rsp) => {
                    setItems([catalogMenu(rsp), registerPanelMenu()]);
                })
                .catch((error: Error) => {
                    console.log(error.message);
                    setItems([catalogMenu([]), registerPanelMenu()]);
                });
        } else {
            ServiceVendorService.listCategories()
                .then((rsp) => {
                    setItems([servicesMenu(rsp), serviceListMenu(), monitorMenu(), credentialMenu()]);
                })
                .catch((error: Error) => {
                    console.log(error.message);
                    setItems([]);
                });
        }
    }, []);

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
