/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Flex, Form, Radio } from 'antd';
import React from 'react';

export const MigrateServiceSubmitBillingMode = ({ selectBillMode }: { selectBillMode: string }): React.JSX.Element => {
    return (
        <>
            <Form.Item
                key={'BillingMode'}
                label={<p style={{ fontWeight: 'bold' }}>{'Billing Mode'}</p>}
                required={true}
            >
                <Flex vertical gap='middle'>
                    <Radio.Group disabled={true} buttonStyle='solid' value={selectBillMode}>
                        <Radio.Button key={selectBillMode} value={selectBillMode}>
                            {selectBillMode}
                        </Radio.Button>
                    </Radio.Group>
                </Flex>
            </Form.Item>
        </>
    );
};
