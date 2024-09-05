/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Form, Row, Select, Space } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export default function VersionSelect({
    selectVersion,
    versionList,
    onChangeVersion,
}: {
    selectVersion: string;
    versionList: { value: string; label: string }[];
    onChangeVersion: (version: string) => void;
}): React.JSX.Element {
    return (
        <Row className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Col className={serviceOrderStyles.orderFormLabel}>
                <Form.Item
                    label={
                        <p
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                        >
                            {'Version'}
                        </p>
                    }
                    labelCol={{ style: { textAlign: 'left' } }}
                ></Form.Item>
            </Col>
            <Col>
                <Space wrap>
                    <Select
                        value={selectVersion}
                        className={serviceOrderStyles.versionDropDown}
                        onChange={onChangeVersion}
                        options={versionList}
                    />
                </Space>
            </Col>
        </Row>
    );
}
