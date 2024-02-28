/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { MonitorTypeList } from './metricProps';
import { Metric } from '../../../xpanse-api/generated';

export const MonitorMetricsTypeTabs = ({
    setActiveMonitorMetricType,
    activeMonitorMetricType,
}: {
    setActiveMonitorMetricType: (activeMonitorMetricType: Metric.monitorResourceType) => void;
    activeMonitorMetricType: Metric.monitorResourceType;
}) => {
    const chartItems: Tab[] = [];
    MonitorTypeList.forEach((monitorType: string) => {
        const chartItem: Tab = {
            key: monitorType,
            label: <b>{monitorType}</b>,
            children: [],
        };
        chartItems.push(chartItem);
    });

    const onChangeMonitorMetricType = (value: string) => {
        setActiveMonitorMetricType(value as Metric.monitorResourceType);
    };

    return (
        <>
            <div>
                <Tabs activeKey={activeMonitorMetricType} items={chartItems} onChange={onChangeMonitorMetricType} />
            </div>
        </>
    );
};
