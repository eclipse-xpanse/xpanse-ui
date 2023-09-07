/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Divider, Dropdown, MenuProps, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { homePageRoute, userRoleKey } from '../../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import Logout from '../../content/login/Logout';
import { useOidcIdToken } from '@axa-fr/react-oidc';
import { allowRoleList, getRolesOfUser, getUserName } from '../../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export const HeaderUserRoles = (): React.JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const { useToken } = theme;
    const { token } = useToken();
    const [currentUser, setCurrentUser] = useState<string>('');
    const [currentRole, setCurrentRole] = useState<string>('');
    const [roleList, setRoleList] = useState<string[]>([]);
    const [menuProps, setMenuProps] = useState<MenuProps | undefined>(undefined);
    const oidcIdToken: OidcIdToken = useOidcIdToken();

    useEffect(() => {
        const userName: string = getUserName(oidcIdToken.idTokenPayload as object);
        setCurrentUser(userName);

        const availableRolesToUser: string[] = getRolesOfUser(oidcIdToken.idTokenPayload as object);
        setRoleList(availableRolesToUser);

        const currentRole: string | null = sessionStorage.getItem(userRoleKey);
        if (currentRole !== null) {
            setCurrentRole(currentRole);
        } else {
            availableRolesToUser.forEach((role) => {
                if (allowRoleList.includes(role)) {
                    sessionStorage.setItem(userRoleKey, role);
                    return;
                }
            });
        }
    }, [oidcIdToken.idTokenPayload]);

    useEffect(() => {
        if (roleList.length === 0 || currentRole.length === 0) {
            return;
        }

        const subItems: MenuItem[] = [];
        roleList.forEach((item) => {
            const menuItem: MenuItem = { label: item, key: item };
            subItems.push(menuItem);
        });

        const items: MenuItem[] = [getItem('Switch Role', 'switchRole', null, subItems)];
        let selectable = false;
        if (roleList.length > 1) {
            selectable = true;
        }
        setMenuProps({
            items,
            onClick: handleMenuClick,
            selectable: selectable,
            selectedKeys: [currentRole],
            defaultOpenKeys: ['switchRole'],
            mode: 'vertical',
            style: menuStyle,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleList, currentRole]);

    const contentStyle = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    const menuStyle = {
        boxShadow: 'none',
    };

    const handleMenuClick: MenuProps['onClick'] = (value) => {
        setCurrentRole(value.key);
        sessionStorage.setItem(userRoleKey, value.key);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const origin: string = (location.state?.from?.pathname as string) || homePageRoute;
        navigate(origin);
        window.location.reload();
    };

    return (
        <Space align='baseline'>
            <Dropdown
                menu={menuProps}
                dropdownRender={(menu) => (
                    <div style={contentStyle}>
                        {menu}
                        <Divider style={{ margin: 0 }} />
                        <Space style={{ padding: 8 }}>
                            <Logout />
                        </Space>
                    </div>
                )}
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Space>
                        <UserOutlined />
                        {currentUser} &nbsp;
                    </Space>
                </a>
            </Dropdown>
        </Space>
    );
};
