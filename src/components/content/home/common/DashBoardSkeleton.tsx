/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Card, Skeleton } from 'antd';
import React from 'react';
import '../../../../styles/dashboard.css';

export function DashBoardSkeleton(): React.JSX.Element {
    return (
        <Card title='Services Dashboard' bordered={true}>
            <Skeleton avatar={false} active={true} paragraph={{ rows: 1 }} className={'dashboard-pending'} />
        </Card>
    );
}
