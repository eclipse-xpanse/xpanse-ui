/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Row, Skeleton, Space } from 'antd';

function ServicesSkeleton() {
    return (
        <div className={'services-content'}>
            <div className={'content-title'}>
                <Skeleton active={true} paragraph={{ rows: 0 }} />
            </div>
            <div className={'services-content-body'}>
                {Array.from({ length: 9 }, () => (
                    <Row key={0}>
                        <Col span={8} className={'services-content-body-col'}>
                            <Space direction='vertical' size='middle'>
                                <div className={'service-type-option-detail-skeleton ant-skeleton-header'}>
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
