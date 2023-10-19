/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Select } from 'antd';
import { DeployJsonSchema, DeployParam, SelectOnChangeHandler } from './CommonTypes';
import { useState } from 'react';

export function SelectField({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: SelectOnChangeHandler;
}): React.JSX.Element {
    const [valueList, setValueList] = useState<string[]>([]);

    for (const key in item.valueSchema) {
        if (key === DeployJsonSchema.ENUM.valueOf()) {
            setValueList(item.valueSchema[key] as unknown as string[]);
        }
    }

    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item
                    name={item.name}
                    label={item.name + ':  (' + item.description + ')'}
                    rules={[
                        { type: 'enum' },
                        {
                            required: true,
                            message: 'Please select an option.',
                        },
                    ]}
                >
                    <Select onChange={onChangeHandler} size='large'>
                        {valueList.map((value) => (
                            <Select.Option key={value} value={value} className='credential-select-option-csp'>
                                {value}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
