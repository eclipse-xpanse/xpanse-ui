/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';

export function ServiceProviderSkeleton(): React.JSX.Element {
    return (
        <Skeleton
            className={catalogStyles.catalogCspDetailsSkeleton}
            active={true}
            loading={true}
            paragraph={{ rows: 2, width: ['20%', '20%'] }}
            title={{ width: '5%' }}
        />
    );
}
