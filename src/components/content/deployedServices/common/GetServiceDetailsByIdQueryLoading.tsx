/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Skeleton } from 'antd';

export const GetServiceDetailsByIdQueryLoading = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <Skeleton
            className={'my-service-details-skeleton'}
            active={true}
            loading={isLoading}
            paragraph={{ rows: 2, width: ['20%', '20%'] }}
            title={{ width: '5%' }}
        />
    );
};
