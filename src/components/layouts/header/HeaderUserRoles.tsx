/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Divider, Dropdown, MenuProps, Space, theme } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { homePageRoute } from '../../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import Logout from '../../content/login/Logout';
import { allowRoleList, getRolesOfUser, getUserName } from '../../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';
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

export function HeaderUserRoles({ oidcIdToken }: { oidcIdToken: OidcIdToken }): React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const { useToken } = theme;
    const { token } = useToken();
    let menuProps: MenuProps | undefined = undefined;
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);
    const updateCurrentUserRole = useCurrentUserRoleStore((state) => state.addCurrentUserRole);
    const userName: string = getUserName(oidcIdToken.idTokenPayload as object);
    const roleList: string[] = getRolesOfUser(oidcIdToken.idTokenPayload as object);
    let updatedRole: string | undefined = undefined;
    // we must take the previously selected role if available.
    if (currentRole !== undefined && roleList.includes(currentRole)) {
        updatedRole = currentRole;
    } else {
        // if no role is already cached, then take the first valid role from the list of available roles for the user.
        roleList.forEach((role) => {
            if (allowRoleList.includes(role)) {
                updateCurrentUserRole(role);
                updatedRole = role;
                return;
            }
        });
    }

    if (roleList.length !== 0 && updatedRole) {
        const subItems: MenuItem[] = [];
        roleList.forEach((item) => {
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
            selectable: roleList.length > 1,
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
                        {userName} &nbsp;
                    </Space>
                </a>
            </Dropdown>
        </Space>
    );
}
