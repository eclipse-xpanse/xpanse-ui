/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';
import appStyles from '../../../styles/app.module.css';
import headerStyles from '../../../styles/header.module.css';
import SystemStatusBar from '../../content/systemStatus/SystemStatusBar';
import { HeaderUserRoles } from './HeaderUserRoles';
import { SearchServices } from './SearchServices.tsx';
import { useCurrentUserRoleStore } from './useCurrentRoleStore.ts';

function LayoutHeader({ userName, roles }: { userName: string; roles: string[] }): React.JSX.Element {
    const currentRole = useCurrentUserRoleStore((state) => state.currentUserRole);
    return (
        <Header className={headerStyles.layoutHeader}>
            <div className={appStyles.headerMenu}>
                <Space align='baseline'>
                    {currentRole && currentRole === 'user' ? <SearchServices /> : <></>}
                    <SystemStatusBar />
                    {userName !== '' ? <HeaderUserRoles userName={userName} roles={roles} /> : null}
                </Space>
            </div>
        </Header>
    );
}

export default LayoutHeader;
