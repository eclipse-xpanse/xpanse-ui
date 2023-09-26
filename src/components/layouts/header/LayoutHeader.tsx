/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Header } from 'antd/es/layout/layout';
import SystemStatusBar from '../../content/systemStatus/SystemStatusBar';
import { HeaderUserRoles } from './HeaderUserRoles';
import React from 'react';
import '../../../styles/layout_header_footer.css';

function LayoutHeader(): React.JSX.Element {
    return (
        <Header className={'layout-header-class'}>
            <div className={'header-menu'}>
                <SystemStatusBar />
                <HeaderUserRoles />
            </div>
        </Header>
    );
}

export default LayoutHeader;
