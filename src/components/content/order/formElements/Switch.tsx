/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Switch as AntdSwitch } from 'antd';
import { DeployParam, SwitchOnChangeHandler } from './CommonTypes';

export function Switch({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: SwitchOnChangeHandler;
}): JSX.Element {
    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item
                    name={item.name}
                    label={item.name + ':  (' + item.description + ')'}
                    rules={[{ type: 'boolean' }]}
                >
                    <AntdSwitch onChange={onChangeHandler} defaultChecked={false} />
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
