/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UserOutlined } from '@ant-design/icons';
import { Divider, Dropdown, MenuProps, Space, theme } from 'antd';
import React, { memo } from 'react';
import { env } from '../../../config/config.ts';
import headerStyles from '../../../styles/header.module.css';
import Logout from '../../content/login/Logout';
import { allowRoleList } from '../../oidc/OidcConfig';
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

// we cache this component to ensure it does not render again when the user changes the role.
// the parent component listens to zustand state which causes this component to render again.
// To avoid this, the component is wrapped with a memo.
const HeaderUserRoles = memo(({ userName, roles }: { userName: string; roles: string[] }) => {
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
                updateCurrentUserRole(role, false);
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
            updateCurrentUserRole(value.key, true);
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
});

HeaderUserRoles.displayName = 'HeaderUserRoles';
export default HeaderUserRoles;
