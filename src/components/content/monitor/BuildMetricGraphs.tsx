/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Col, Row, Tooltip } from 'antd';
import { EChartsCoreOption } from 'echarts';
import EChartsReact from 'echarts-for-react';
import React from 'react';
import monitorStyles from '../../../styles/monitor.module.css';

export const BuildMetricGraphs = ({
    chartsPerRow,
    graphData,
    chartsTitle,
}: {
    chartsPerRow: string;
    graphData: EChartsCoreOption[];
    chartsTitle: { Id: string; metricTitle: string; metricSubTitle: string }[];
}): React.JSX.Element => {
    const currentChartCols: React.JSX.Element[] = [];
    if (graphData.length > 0 && chartsTitle.length > 0) {
        for (let i = 0; i < graphData.length; i++) {
            currentChartCols.push(
                <Col key={i.toString()} span={graphData.length > 0 ? 24 / Number(chartsPerRow) : 24}>
                    <div className={monitorStyles.chartsPositionClass}>
                        <div className={monitorStyles.chartTitleClass}>
                            <Tooltip
                                placement='bottom'
                                title={chartsTitle[i].Id}
                                color={'#8ca2e4'}
                                styles={{ root: { maxWidth: 300 } }}
                            >
                                <Button className={monitorStyles.chartSubtitleHoverClass}>
                                    {chartsTitle[i].metricTitle}
                                    {'  '}
                                    {chartsTitle[i].metricSubTitle}
                                </Button>
                            </Tooltip>
                        </div>
                        <EChartsReact option={graphData[i]} />
                    </div>
                </Col>
            );
        }
    }

    return (
        <>
            <Row gutter={[8, 8]}>{currentChartCols}</Row>
        </>
    );
};
