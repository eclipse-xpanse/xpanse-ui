/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOutlined } from '@ant-design/icons';
import { Divider, Dropdown, MenuProps, Space, theme } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { env } from '../../../config/config.ts';
import headerStyles from '../../../styles/header.module.css';
import Logout from '../../content/login/Logout';
import { allowRoleList } from '../../oidc/OidcConfig';
import { homePageRoute } from '../../utils/constants';
import { useCurrentUserRoleStore } from './useCurrentRoleStore';

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

export function HeaderUserRoles({ userName, roles }: { userName: string; roles: string[] }): React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const { useToken } = theme;
    const { token } = useToken();
    let menuProps: MenuProps | undefined = undefined;
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);
    const updateCurrentUserRole = useCurrentUserRoleStore((state) => state.addCurrentUserRole);
    let updatedRole: string | undefined = undefined;
    // we must take the previously selected role if available.
    if (currentRole !== undefined && roles.includes(currentRole)) {
        updatedRole = currentRole;
    } else {
        // if no role is already cached, then take the first valid role from the list of available roles for the user.
        roles.forEach((role) => {
            if (allowRoleList.includes(role)) {
                updateCurrentUserRole(role);
                updatedRole = role;
                return;
            }
        });
    }

    if (roles.length !== 0 && updatedRole) {
        const subItems: MenuItem[] = [];
        roles.forEach((item) => {
            const menuItem: MenuItem = { label: item, key: item };
            subItems.push(menuItem);
        });

        const items: MenuItem[] = [getItem('Switch Role', 'switchRole', null, subItems)];
        const menuStyle = {
            boxShadow: 'none',
        };

        const handleMenuClick: MenuProps['onClick'] = (value) => {
            updateCurrentUserRole(value.key);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const origin: string = (location.state?.from?.pathname as string) || homePageRoute;
            navigate(origin);
        };

        menuProps = {
            items,
            onClick: handleMenuClick,
            selectable: roles.length > 1,
            selectedKeys: [updatedRole],
            defaultOpenKeys: ['switchRole'],
            mode: 'vertical',
            style: menuStyle,
        };
    }

    const contentStyle = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    return (
        <Space align='baseline' className={headerStyles.userInfoSpacing}>
            <Dropdown
                menu={menuProps}
                dropdownRender={(menu) => (
                    <div style={contentStyle}>
                        {menu}
                        <Divider style={{ margin: 0 }} />
                        {env.VITE_APP_AUTH_DISABLED !== 'true' ? (
                            <Space style={{ padding: 8 }}>
                                <Logout />
                            </Space>
                        ) : (
                            <> </>
                        )}
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
                        {userName} &nbsp;
                    </Space>
                </a>
            </Dropdown>
        </Space>
    );
}
