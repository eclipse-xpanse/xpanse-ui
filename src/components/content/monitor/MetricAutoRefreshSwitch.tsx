/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Switch } from 'antd';
import React from 'react';

export const MetricAutoRefreshSwitch = ({
    isLoading,
    isAutoRefresh,
    setIsAutoRefresh,
}: {
    isLoading: boolean;
    isAutoRefresh: boolean;
    setIsAutoRefresh: (currentIsAutoRefresh: boolean) => void;
}): React.JSX.Element => {
    const onChangeAutoRefresh = (isChecked: boolean) => {
        setIsAutoRefresh(isChecked);
    };
    return (
        <>
            Auto Refresh:&nbsp;
            <Switch checked={isAutoRefresh} onChange={onChangeAutoRefresh} disabled={isLoading} />
            &nbsp;&nbsp; &nbsp;
        </>
    );
};
