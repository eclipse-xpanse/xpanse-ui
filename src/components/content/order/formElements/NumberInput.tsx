/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { NumberInputEventHandler, DeployParam } from './CommonTypes';
import { Form, InputNumber } from 'antd';

export function NumberInput({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: NumberInputEventHandler;
}): JSX.Element {
    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item
                    name={item.name}
                    label={item.name + ' :  ' + item.description}
                    rules={[{ required: item.mandatory }, { type: 'number', min: 0 }]}
                >
                    <InputNumber onChange={onChangeHandler} />
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
