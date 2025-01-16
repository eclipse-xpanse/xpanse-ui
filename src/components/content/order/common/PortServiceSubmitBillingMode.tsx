/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Flex, Form, Radio, Row } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const PortServiceSubmitBillingMode = ({ selectBillMode }: { selectBillMode: string }): React.JSX.Element => {
    return (
        <Row className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Col className={serviceOrderStyles.orderFormLabel}>
                <Form.Item
                    key={'BillingMode'}
                    label={
                        <p
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                        >
                            {'Billing Mode'}
                        </p>
                    }
                    labelCol={{ style: { textAlign: 'left' } }}
                    required={true}
                ></Form.Item>
            </Col>
            <Col>
                <Flex vertical gap='middle'>
                    <Radio.Group disabled={true} buttonStyle='solid'>
                        <Radio.Button key={selectBillMode} value={selectBillMode}>
                            {selectBillMode}
                        </Radio.Button>
                    </Radio.Group>
                </Flex>
            </Col>
        </Row>
    );
};
