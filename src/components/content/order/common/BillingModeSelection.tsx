/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { Dispatch, SetStateAction } from 'react';
import { Alert, Flex, Form, Radio } from 'antd';
import { DeployRequest } from '../../../../xpanse-api/generated';

export const BillingModeSelection = ({
    selectBillingMode,
    setSelectBillingMode,
    billingModes,
}: {
    selectBillingMode: string;
    setSelectBillingMode: Dispatch<SetStateAction<string>>;
    billingModes: DeployRequest.billingMode[] | undefined;
}): React.JSX.Element => {
    function onChange(value: string) {
        setSelectBillingMode(value);
    }

    return (
        <>
            <Form.Item
                key={'BillingMode'}
                label={<p style={{ fontWeight: 'bold' }}>{'BillingMode'}</p>}
                required={true}
                rules={[
                    {
                        required: true,
                        message: 'billingMode is required',
                    },
                    { type: 'string' },
                ]}
            >
                {billingModes && billingModes.length > 0 ? (
                    <Flex vertical gap='middle'>
                        <Radio.Group
                            buttonStyle='solid'
                            onChange={(e) => {
                                onChange(e.target.value as string);
                            }}
                            value={selectBillingMode}
                        >
                            {billingModes.map((mode: DeployRequest.billingMode) => (
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
            </Form.Item>
        </>
    );
};
