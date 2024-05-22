/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Skeleton } from 'antd';
import React from 'react';
import lazyLoadingStyles from '../../../../styles/lazy-loading.module.css';

export default function FallbackSkeleton(): React.JSX.Element {
    return <Skeleton className={lazyLoadingStyles.lazyLoadingCommonSkeleton} />;
}
