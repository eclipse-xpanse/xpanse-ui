/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import EChartsReact from 'echarts-for-react';
import 'echarts/lib/chart/bar';
import '../../../styles/monitor.css';
import { Button, Col, Radio, RadioChangeEvent, Row, Select, Switch, Tooltip } from 'antd';
import moment from 'moment';
import {
    colColumnList,
    getCurrentMetricProps,
    getLayOutOptions,
    getOptionData,
    getTotalSecondsOfTimePeriod,
    MetricProps,
    timePeriodList,
} from './metricProps';
import * as echarts from 'echarts/core';
import { Metric } from '../../../xpanse-api/generated';

function MonitorChart({
    monitorType,
    metricProps,
    onAutoRefresh,
}: {
    monitorType: string;
    metricProps: MetricProps[];
    onAutoRefresh: (switchResult: boolean) => void;
}): JSX.Element {
    const [options, setOptions] = useState<echarts.EChartsCoreOption[]>([]);
    const [chartsTitle, setChartsTitle] = useState<{ Id: string; metricTitle: string; metricSubTitle: string }[]>([]);

    const [timePeriod, setTimePeriod] = useState<number>(1);
    const [colCountKey, setColCountKey] = useState(2);
    const [isAutoRefreshChecked, setIsAutoRefreshChecked] = useState<boolean>(true);

    useEffect(() => {
        const currentMetricProps: Map<string, MetricProps[]> = getCurrentMetricProps(metricProps, monitorType);
        const currentTime = new Date();
        const totalSeconds: number = getTotalSecondsOfTimePeriod(timePeriod);
        currentTime.setSeconds(currentTime.getSeconds() - totalSeconds);

        const chartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[] = [];
        const options: echarts.EChartsCoreOption[] = [];
        currentMetricProps.forEach((metricProps, vmId) => {
            chartsTitle.push({
                Id: vmId,
                metricTitle: metricProps[0].name
                    .split('_')[0]
                    .concat(
                        ' usage (' +
                            (metricProps[0].unit === Metric.unit.PERCENTAGE ? '%' : metricProps[0].unit.valueOf()) +
                            ') - '
                    ),
                metricSubTitle: metricProps[0].vmName,
            });
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
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        fontSize: 10,
                        rotate: 40,
                        formatter: function (value: Date) {
                            const date = moment(value).format('YYYY-MM-DD');
                            const time = moment(value).format('HH:mm:ss');
                            return date + '\n' + time;
                        },
                    },
                    axisTick: {
                        show: true,
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
                    top: '5%',
                    containLabel: true,
                },
                series: [
                    {
                        name: metricProps[0].name
                            .split('_')[0]
                            .concat(
                                ' usage (' +
                                    (metricProps[0].unit === Metric.unit.PERCENTAGE
                                        ? '%'
                                        : metricProps[0].unit.valueOf()) +
                                    ') - '
                            ),
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        areaStyle: { marginBottom: '0px' },
                        data: getOptionData(metricProps, currentTime, totalSeconds),
                    },
                ],
            };
            options.push(option);
        });
        setChartsTitle(chartsTitle);
        setOptions(options);
    }, [timePeriod, metricProps, monitorType]);

    const onChangeTimePeriod = (e: RadioChangeEvent) => {
        const timePeriodValue = Number(e.target.value);
        setTimePeriod(timePeriodValue);
    };

    const onChangeAutoRefresh = (checked: boolean) => {
        setIsAutoRefreshChecked(checked);
        onAutoRefresh(checked);
    };

    const handleChange = (value: string) => {
        if (options.length > 1) {
            setColCountKey(Number(value));
        }
    };
    const cols: JSX.Element[] = [];
    let colCount = 0;
    colColumnList.forEach((item) => {
        if (item === Number(colCountKey)) {
            colCount = item;
        }
    });

    for (let i = 0; i < options.length; i++) {
        cols.push(
            <Col key={i.toString()} span={24 / colCount}>
                <div className={'charts-position-class'}>
                    <div className={'chart-title-class'}>
                        <Tooltip
                            placement='bottom'
                            title={chartsTitle[i].Id}
                            color={'#8ca2e4'}
                            overlayStyle={{ maxWidth: 300 }}
                        >
                            <Button className={'chart-subtitle-hover-class'}>
                                {chartsTitle[i].metricTitle}
                                {'  '}
                                {chartsTitle[i].metricSubTitle}
                            </Button>
                        </Tooltip>
                    </div>
                    <EChartsReact option={options[i]} />
                </div>
            </Col>
        );
    }

    const layOutOptions: { value: string; label: string }[] = getLayOutOptions();

    return (
        <>
            <div className={'chart-operation-class'}>
                <div>
                    <Radio.Group onChange={onChangeTimePeriod} value={timePeriod}>
                        {timePeriodList.map((item, index) => (
                            <Radio key={index} value={index + 1}>
                                {item}
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>
                <br />
                <br />
                <br />
                <div>
                    Auto Refresh:&nbsp;
                    <Switch checked={isAutoRefreshChecked} onChange={onChangeAutoRefresh} />
                    &nbsp;&nbsp;Charts per Row:&nbsp;
                    <Select defaultValue='2' style={{ width: 55 }} onChange={handleChange} options={layOutOptions} />
                </div>
            </div>
            {options.length > 0 ? <Row gutter={[8, 8]}>{cols}</Row> : <></>}
        </>
    );
}

export default MonitorChart;
