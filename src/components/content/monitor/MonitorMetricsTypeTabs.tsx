/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { monitorResourceType } from '../../../xpanse-api/generated';
import { MonitorTypeList } from './metricProps';

export const MonitorMetricsTypeTabs = ({
    setActiveMonitorMetricType,
    activeMonitorMetricType,
}: {
    setActiveMonitorMetricType: (activeMonitorMetricType: monitorResourceType) => void;
    activeMonitorMetricType: monitorResourceType;
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
        setActiveMonitorMetricType(value as monitorResourceType);
    };

    return (
        <>
            <div>
                <Tabs activeKey={activeMonitorMetricType} items={chartItems} onChange={onChangeMonitorMetricType} />
            </div>
        </>
    );
};
