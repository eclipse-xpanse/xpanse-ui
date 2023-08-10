/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Switch } from 'antd';
import React, { useState } from 'react';

export const MetricIsAutoRefresh = ({
    isLoading,
    getIsAutoRefresh,
}: {
    isLoading: boolean;
    getIsAutoRefresh: (currentIsAutoRefresh: boolean) => void;
}): JSX.Element => {
    const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
    const onChangeAutoRefresh = (isChecked: boolean) => {
        setIsAutoRefresh(isChecked);
        getIsAutoRefresh(isChecked);
    };
    return (
        <>
            Auto Refresh:&nbsp;
            <Switch checked={isAutoRefresh} onChange={onChangeAutoRefresh} disabled={isLoading} />
            &nbsp;&nbsp; &nbsp;
        </>
    );
};
