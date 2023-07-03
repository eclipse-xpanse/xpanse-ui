/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { MonitorTypeList } from './metricProps';
import { Metric } from '../../../xpanse-api/generated';

export const MonitorMetricsType = ({
    getActiveMonitorMetricType,
}: {
    getActiveMonitorMetricType: (activeMonitorMetricType: string) => void;
}) => {
    const [monitorChartItems, setMonitorChartItems] = useState<Tab[]>([]);
    const [activeMonitorMetricType, setActiveMonitorMetricType] = useState<string>(
        Metric.monitorResourceType.CPU.valueOf()
    );

    useEffect(() => {
        const chartItems: Tab[] = [];
        MonitorTypeList.forEach((monitorType: string) => {
            const chartItem: Tab = {
                key: monitorType,
                label: <b>{monitorType}</b>,
                children: [],
            };
            chartItems.push(chartItem);
        });
        setMonitorChartItems(chartItems);
    }, []);

    const onChangeMonitorMetricType = (value: string) => {
        setActiveMonitorMetricType(value);
        getActiveMonitorMetricType(value);
    };

    return (
        <>
            <div>
                <Tabs
                    activeKey={activeMonitorMetricType}
                    items={monitorChartItems}
                    onChange={onChangeMonitorMetricType}
                />
            </div>
        </>
    );
};
