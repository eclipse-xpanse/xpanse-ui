/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { NumberInputEventHandler, DeployParam, DeployVariableSchema } from './CommonTypes';
import { Form, InputNumber } from 'antd';
import React from 'react';
import { Rule } from 'rc-field-form/lib/interface';

export function NumberInput({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: NumberInputEventHandler;
}): React.JSX.Element {
    const ruleItems: Rule[] = [{ required: item.mandatory }, { type: 'number' }];
    let minimum: number;
    let maximum: number;

    const setValidator = (_: unknown, value: number) => {
        if (value <= minimum) {
            return Promise.reject(new Error(`Value does not satisfy criteria minimum ${minimum}!`));
        }
        if (value >= maximum) {
            return Promise.reject(new Error(`Value does not satisfy criteria maximum ${maximum}!`));
        }
    };

    for (const key in item.valueSchema) {
        if (key === DeployVariableSchema.MINIMUM.valueOf()) {
            minimum = item.valueSchema[key] as unknown as number;
            ruleItems.push({ validator: setValidator });
        } else if (key === DeployVariableSchema.MAXIMUM.valueOf()) {
            maximum = item.valueSchema[key] as unknown as number;
            ruleItems.push({ validator: setValidator });
        }
    }
    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item name={item.name} label={item.name + ' :  ' + item.description} rules={ruleItems}>
                    <InputNumber onChange={onChangeHandler} />
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
