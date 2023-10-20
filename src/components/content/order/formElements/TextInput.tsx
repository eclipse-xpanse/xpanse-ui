/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Input, Select, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { DeployVariableSchema, DeployParam, EnumSelectEventHandler, TextInputEventHandler } from './CommonTypes';
import { DeployVariable } from '../../../../xpanse-api/generated';
import React, { useEffect, useState } from 'react';
import { Rule } from 'rc-field-form/lib/interface';

export function TextInput({
    item,
    onChangeHandler,
}: {
    item: DeployParam;
    onChangeHandler: TextInputEventHandler | EnumSelectEventHandler;
}): React.JSX.Element {
    const ruleItems: Rule[] = [{ required: item.mandatory }, { type: 'string' }];
    let regExp: RegExp;
    const [valueList, setValueList] = useState<string[]>([]);
    const [isEnum, setIsEnum] = useState<boolean>(false);
    const setValidator = (_: unknown, value: string) => {
        if (!regExp.test(value)) {
            return Promise.reject(new Error(` the provided input does not match the pattern! ${regExp}`));
        }
        return Promise.resolve();
    };

    useEffect(() => {
        for (const key in item.valueSchema) {
            if (key === DeployVariableSchema.ENUM.valueOf()) {
                setIsEnum(true);
                setValueList(item.valueSchema[key] as unknown as string[]);
                ruleItems.push(
                    { type: 'enum' },
                    {
                        required: true,
                        message: 'Please select an option.',
                    }
                );
            } else if (key === DeployVariableSchema.MINLENGTH.valueOf()) {
                ruleItems.push({ type: 'string' }, { min: item.valueSchema[key] as unknown as number });
            } else if (key === DeployVariableSchema.MAXLENGTH.valueOf()) {
                ruleItems.push({ type: 'string' }, { max: item.valueSchema[key] as unknown as number });
            } else if (key === DeployVariableSchema.PATTERN.valueOf()) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                regExp = new RegExp(item.valueSchema[key] as unknown as string);
                ruleItems.push({ type: 'string' }, { validator: setValidator });
            }
        }
    }, [item.valueSchema]);
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
                            onChange={onChangeHandler as TextInputEventHandler}
                        />
                    ) : isEnum ? (
                        <Select onChange={onChangeHandler as EnumSelectEventHandler} size='large'>
                            {valueList.map((value) => (
                                <Select.Option key={value} value={value} className='credential-select-option-csp'>
                                    {value}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            name={item.name}
                            placeholder={item.example}
                            suffix={
                                <Tooltip title={item.description}>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            onChange={onChangeHandler as TextInputEventHandler}
                        />
                    )}
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
