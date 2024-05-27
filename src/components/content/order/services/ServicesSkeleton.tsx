/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Row, Skeleton, Space } from 'antd';
import React from 'react';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';

function ServicesSkeleton(): React.JSX.Element {
    return (
        <div className={tableStyles.genericTableContainer}>
            <div className={appStyles.contentTitle}>
                <Skeleton active={true} paragraph={{ rows: 0 }} />
            </div>
            <div className={serviceOrderStyles.servicesContentBody}>
                {Array.from({ length: 9 }, (_, index) => (
                    <Row key={index}>
                        <Col span={8} className={serviceOrderStyles.servicesContentBodyCol}>
                            <Space direction='vertical' size='middle'>
                                <div
                                    className={`${serviceOrderStyles.serviceTypeOptionDetailSkeleton} ${serviceOrderStyles.antSkeletonHeader}`}
                                >
                                    <Skeleton avatar={true} active={true} paragraph={{ rows: 1 }} />
                                </div>
                            </Space>
                        </Col>
                    </Row>
                ))}
            </div>
        </div>
    );
}

export default ServicesSkeleton;
