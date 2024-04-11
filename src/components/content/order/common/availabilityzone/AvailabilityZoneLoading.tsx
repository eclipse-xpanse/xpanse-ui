/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';

export function AvailabilityZoneLoading() {
    return <Skeleton active={true} loading={true} paragraph={{ rows: 1, width: ['20%'] }} />;
}
