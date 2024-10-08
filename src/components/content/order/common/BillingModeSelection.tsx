/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Col, Flex, Form, Radio, Row } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { billingMode } from '../../../../xpanse-api/generated';

export const BillingModeSelection = ({
    selectBillingMode,
    setSelectBillingMode,
    billingModes,
}: {
    selectBillingMode: billingMode;
    setSelectBillingMode: Dispatch<SetStateAction<billingMode>>;
    billingModes: billingMode[] | undefined;
}): React.JSX.Element => {
    function onChange(value: billingMode) {
        setSelectBillingMode(value);
    }

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
                    rules={[
                        {
                            required: true,
                            message: 'billingMode is required',
                        },
                        { type: 'string' },
                    ]}
                ></Form.Item>
            </Col>
            <Col>
                {billingModes && billingModes.length > 0 ? (
                    <Flex vertical gap='middle'>
                        <Radio.Group
                            buttonStyle='solid'
                            onChange={(e) => {
                                onChange(e.target.value as billingMode);
                            }}
                            value={selectBillingMode}
                        >
                            {billingModes.map((mode: billingMode) => (
                                <Radio.Button key={mode} value={mode}>
                                    {mode}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Flex>
                ) : (
                    <Alert
                        message={'No BillingMode found'}
                        description={'Optional field. Can proceed.'}
                        type={'success'}
                        closable={false}
                    />
                )}
            </Col>
        </Row>
    );
};
