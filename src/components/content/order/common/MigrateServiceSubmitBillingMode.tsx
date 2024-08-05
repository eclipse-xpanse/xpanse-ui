/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Flex, Form, Radio } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export const MigrateServiceSubmitBillingMode = ({ selectBillMode }: { selectBillMode: string }): React.JSX.Element => {
    return (
        <div className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Form.Item
                key={'BillingMode'}
                label={
                    <p
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                    >
                        {'Billing Mode'}
                    </p>
                }
                labelCol={{ span: 2, style: { textAlign: 'left' } }}
                required={true}
            >
                <Flex vertical gap='middle'>
                    <Radio.Group disabled={true} buttonStyle='solid'>
                        <Radio.Button key={selectBillMode} value={selectBillMode}>
                            {selectBillMode}
                        </Radio.Button>
                    </Radio.Group>
                </Flex>
            </Form.Item>
        </div>
    );
};
