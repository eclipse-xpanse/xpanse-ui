/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import * as echarts from 'echarts/core';
import { Button, Col, Row, Tooltip } from 'antd';
import EChartsReact from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

export const MetricOptionDataByChartsPerRow = ({
    chartsPerRow,
    options,
    chartsTitle,
}: {
    chartsPerRow: string;
    options: echarts.EChartsCoreOption[];
    chartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[];
}): JSX.Element => {
    const [chartCols, setChartCols] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (options.length === 0 || chartsTitle.length === 0) {
            return;
        }
        const currentChartCols: JSX.Element[] = [];
        for (let i = 0; i < options.length; i++) {
            currentChartCols.push(
                <Col key={i.toString()} span={options.length > 0 ? 24 / Number(chartsPerRow) : 24}>
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
        setChartCols(currentChartCols);
    }, [options, chartsTitle, chartsPerRow]);

    return (
        <>
            <Row gutter={[8, 8]}>{chartCols}</Row>
        </>
    );
};
