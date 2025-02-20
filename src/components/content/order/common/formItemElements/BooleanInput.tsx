/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch as AntdSwitch, Form, Tooltip } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { ServiceChangeParameter } from '../../../../../xpanse-api/generated';

export function BooleanInput({ actionParameter }: { actionParameter: ServiceChangeParameter }): React.JSX.Element {
    return (
        <div className={serviceOrderStyles.orderParamItemRow}>
            <div className={serviceOrderStyles.orderParamItemContent}>
                <Form.Item
                    key={actionParameter.name}
                    name={actionParameter.name}
                    label={
                        <Tooltip placement='rightTop' title={actionParameter.description}>
                            {actionParameter.name}&nbsp;
                            <QuestionCircleOutlined />
                        </Tooltip>
                    }
                    rules={[{ type: 'boolean' }, { required: true }]}
                    valuePropName='checked'
                    initialValue={actionParameter.initialValue}
                >
                    <AntdSwitch />
                </Form.Item>
            </div>
            <div className={serviceOrderStyles.orderParamItemRight} />
        </div>
    );
}
