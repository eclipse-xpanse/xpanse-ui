/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';

export function ServiceProviderSkeleton(): React.JSX.Element {
    return (
        <Skeleton
            className={'catalog-csp-details-skeleton'}
            active={true}
            loading={true}
            paragraph={{ rows: 2, width: ['20%', '20%'] }}
            title={{ width: '5%' }}
        />
    );
}
