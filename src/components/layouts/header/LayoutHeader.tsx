/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import SystemStatusBar from '../../content/systemStatus/SystemStatusBar';
import { HeaderUserRoles } from './HeaderUserRoles';

function LayoutHeader(): JSX.Element {
    return (
        <Header style={{ width: '100%', background: '#ffffff' }}>
            <div className={'header-menu'}>
                <Space align='baseline'>
                    <SystemStatusBar />
                    <HeaderUserRoles />
                </Space>
            </div>
        </Header>
    );
}

export default LayoutHeader;
