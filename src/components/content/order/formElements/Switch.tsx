/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Switch as AntdSwitch } from 'antd';
import { DeployParam } from './CommonTypes';
import React from 'react';
import { useOrderFormStore } from '../store/OrderFormStore';

export function Switch({ item }: { item: DeployParam }): React.JSX.Element {
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const booleanHandler = (checked: boolean) => {
        cacheFormVariable(item.name, checked ? 'true' : 'false');
    };

    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item
                    name={item.name}
                    label={item.name + ':  (' + item.description + ')'}
                    rules={[{ type: 'boolean' }, { required: item.mandatory }]}
                >
                    <AntdSwitch onChange={booleanHandler} defaultChecked={false} />
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
