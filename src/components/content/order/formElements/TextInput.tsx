/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Input, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { DeployJsonSchema, DeployParam, TextInputEventHandler } from './CommonTypes';
import { DeployVariable } from '../../../../xpanse-api/generated';
import React from 'react';
import { Rule } from 'rc-field-form/lib/interface';
export function TextInput({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: TextInputEventHandler;
}): React.JSX.Element {
    const ruleItems: Rule[] = [{ required: item.mandatory }, { type: 'string' }];
    let regExp: RegExp;
    const setValidator = (_: unknown, value: string) => {
        if (!regExp.test(value)) {
            return Promise.reject(new Error(` the provided input does not match the pattern! ${regExp}`));
        }
        return Promise.resolve();
    };

    for (const key in item.valueSchema) {
        if (key === DeployJsonSchema.MINLENGTH.valueOf()) {
            ruleItems.push({ min: item.valueSchema[key] as unknown as number });
        } else if (key === DeployJsonSchema.MAXLENGTH.valueOf()) {
            ruleItems.push({ max: item.valueSchema[key] as unknown as number });
        } else if (key === DeployJsonSchema.PATTERN.valueOf()) {
            regExp = new RegExp(item.valueSchema[key] as unknown as string);
            ruleItems.push({ validator: setValidator });
        }
    }

    return (
        <div className={'order-param-item-row'}>
            <div className={'order-param-item-left'} />
            <div className={'order-param-item-content'}>
                <Form.Item name={item.name} label={item.name + ' :  ' + item.description} rules={ruleItems}>
                    {item.sensitiveScope === DeployVariable.sensitiveScope.ALWAYS ||
                    item.sensitiveScope === DeployVariable.sensitiveScope.ONCE ? (
                        <Input.Password
                            name={item.name}
                            placeholder={item.example}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={onChangeHandler}
                        />
                    ) : (
                        <Input
                            name={item.name}
                            placeholder={item.example}
                            suffix={
                                <Tooltip title={item.description}>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            onChange={onChangeHandler}
                        />
                    )}
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
