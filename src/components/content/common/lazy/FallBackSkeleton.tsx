/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';

export default function FallbackSkeleton(): React.JSX.Element {
    return <Skeleton className={'lazy-loading-common-skeleton'} />;
}
