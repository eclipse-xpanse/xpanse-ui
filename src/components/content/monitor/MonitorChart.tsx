/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import EChartsReact from 'echarts-for-react';
import 'echarts/lib/chart/bar';
import '../../../styles/monitor.css';
import { Col, Row } from 'antd';
import moment from 'moment';
import { MetricProps } from './metricProps';
import * as echarts from 'echarts/core';

function MonitorChart({ monitorType, metricProps }: { monitorType: string; metricProps: MetricProps[] }): JSX.Element {
    const options: echarts.EChartsCoreOption[] = [];

    const currentMetricProps: Map<string, MetricProps[]> = new Map<string, MetricProps[]>();

    for (const metricProp of metricProps) {
        if (metricProp.id) {
            if (!currentMetricProps.has(metricProp.id)) {
                currentMetricProps.set(
                    metricProp.id,
                    metricProps.filter((data: MetricProps) => data.name === monitorType && data.id === metricProp.id)
                );
            }
        }
    }

    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 1);

    const getOptionData = (metricProps: MetricProps[]) => {
        const dataNew: [number, number][] = [];
        const currentTime = startTime;

        for (let i = 0; i < 12; i++) {
            dataNew.push([+currentTime, 0]);
            currentTime.setSeconds(currentTime.getSeconds() + 5);
        }

        metricProps.forEach((metricProp) => {
            const index = metricProps.indexOf(metricProp);
            if (index !== -1 && dataNew[index] && index < 12) {
                dataNew[index][1] = metricProp.value;
            }
        });
        currentTime.setMinutes(currentTime.getMinutes() - 1);
        return dataNew;
    };

    currentMetricProps.forEach((metricProps, vmId) => {
        const option: echarts.EChartsCoreOption = {
            tooltip: {
                trigger: 'axis',
                position: function (pt: number[]) {
                    return [pt[0], '10%'];
                },
                axisPointer: {
                    type: 'line',
                    handle: {
                        show: true,
                    },
                },
                valueFormatter: function (params: number) {
                    return params.toFixed(2) + '%';
                },
            },
            title: {
                left: 'center',
                subtext: metricProps[0].vmName.concat(': ').concat(vmId),
                text: metricProps[0].name.split('_')[0].concat(' usage(%)'),
                padding: 0,
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    show: true,
                    internal: 0,
                    rotate: 35,
                    formatter: function (value: Date) {
                        return moment(value).format('HH:mm:ss');
                    },
                },
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            series: [
                {
                    name: metricProps[0].name.split('_')[0].concat(' usage'),
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: { marginBottom: '0px' },
                    data: getOptionData(metricProps),
                },
            ],
        };
        options.push(option);
    });

    return (
        <>
            {options.length > 0 ? (
                <Row gutter={[16, 24]}>
                    {options.map((option, index) => {
                        return (
                            <Col key={index} span={8}>
                                <div className={'charts-position-class'}>
                                    <EChartsReact option={option} />
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <></>
            )}
        </>
    );
}

export default MonitorChart;
