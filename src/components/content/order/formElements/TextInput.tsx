/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Input, Select, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { DeployVariableSchema, DeployParam } from './CommonTypes';
import { DeployVariable } from '../../../../xpanse-api/generated';
import React, { ChangeEvent } from 'react';
import { Rule } from 'rc-field-form/lib/interface';
import { useOrderFormStore } from '../store/OrderFormStore';

export function TextInput({ item }: { item: DeployParam }): React.JSX.Element {
    const ruleItems: Rule[] = [{ required: item.mandatory }, { type: 'string' }];
    let regExp: RegExp;
    let valueList: string[] = [];
    let isEnum: boolean = false;

    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    const getStringEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        cacheFormVariable(event.target.name, event.target.value);
    };

    const getEventEventHandler = (event: string) => {
        cacheFormVariable(item.name, event);
    };

    for (const key in item.valueSchema) {
        if (key === DeployVariableSchema.ENUM.valueOf()) {
            isEnum = true;
            valueList = item.valueSchema[key] as unknown as string[];
        } else if (key === DeployVariableSchema.MINLENGTH.valueOf()) {
            ruleItems.push({ min: item.valueSchema[key] as unknown as number });
        } else if (key === DeployVariableSchema.MAXLENGTH.valueOf()) {
            ruleItems.push({ max: item.valueSchema[key] as unknown as number });
        } else if (key === DeployVariableSchema.PATTERN.valueOf()) {
            regExp = new RegExp(item.valueSchema[key] as unknown as string);
            ruleItems.push({ pattern: regExp });
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
                            onChange={getStringEventHandler}
                        />
                    ) : isEnum ? (
                        <Select onChange={getEventEventHandler} size='large'>
                            {valueList.map((value) => (
                                <Select.Option key={value} value={value} className={'order-deploy-select-option'}>
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
                            onChange={getStringEventHandler}
                        />
                    )}
                </Form.Item>
            </div>
            <div className={'order-param-item-right'} />
        </div>
    );
}
