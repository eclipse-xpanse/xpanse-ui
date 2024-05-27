/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Switch as AntdSwitch, Form } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { useOrderFormStore } from '../store/OrderFormStore';
import { DeployParam } from '../types/DeployParam';

export function BooleanInput({ item }: { item: DeployParam }): React.JSX.Element {
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const booleanHandler = (checked: boolean) => {
        cacheFormVariable(item.name, checked);
    };

    return (
        <div className={serviceOrderStyles.orderParamItemRow}>
            <div className={serviceOrderStyles.orderParamItemLeft} />
            <div className={serviceOrderStyles.orderParamItemContent}>
                <Form.Item
                    name={item.name}
                    label={item.name + ':  (' + item.description + ')'}
                    rules={[{ type: 'boolean' }, { required: item.mandatory }]}
                    valuePropName='checked'
                >
                    <AntdSwitch onChange={booleanHandler} defaultChecked={false} />
                </Form.Item>
            </div>
            <div className={serviceOrderStyles.orderParamItemRight} />
        </div>
    );
}
