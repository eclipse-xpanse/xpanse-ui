/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Skeleton } from 'antd';
import React from 'react';
import dashboardStyles from '../../../../styles/dashboard.module.css';

export function DashBoardSkeleton(): React.JSX.Element {
    return (
        <Card title='Services Dashboard' variant={'outlined'}>
            <Skeleton
                avatar={false}
                active={true}
                paragraph={{ rows: 1 }}
                className={dashboardStyles.dashboardPending}
            />
        </Card>
    );
}
