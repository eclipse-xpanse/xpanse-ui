/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, InputNumber } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { useOrderFormStore } from '../store/OrderFormStore';
import { DeployParam } from '../types/DeployParam';
import { DeployVariableSchema } from '../types/DeployVariableSchema';

export function NumberInput({ item }: { item: DeployParam }): React.JSX.Element {
    const ruleItems: Rule[] = [{ required: item.mandatory }, { type: 'number' }];
    let minimum: number;
    let maximum: number;

    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const setValidator = (_: unknown, value: number) => {
        if (value < minimum) {
            return Promise.reject(new Error(`Value does not satisfy criteria minimum ${minimum.toString()}!`));
        }
        if (value > maximum) {
            return Promise.reject(new Error(`Value does not satisfy criteria maximum ${maximum.toString()}!`));
        } else {
            return Promise.resolve();
        }
    };

    const numberInputHandler = (value: string | number | null) => {
        cacheFormVariable(item.name, value as string);
    };

    for (const key in item.valueSchema) {
        if (key === DeployVariableSchema.MINIMUM.valueOf()) {
            minimum = item.valueSchema[key] as unknown as number;
            ruleItems.push({ validator: setValidator });
            break;
        } else if (key === DeployVariableSchema.MAXIMUM.valueOf()) {
            maximum = item.valueSchema[key] as unknown as number;
            ruleItems.push({ validator: setValidator });
            break;
        }
    }

    return (
        <div className={serviceOrderStyles.orderParamItemRow}>
            <div className={serviceOrderStyles.orderParamItemLeft} />
            <div className={serviceOrderStyles.orderParamItemContent}>
                <Form.Item name={item.name} label={item.name + ' :  ' + item.description} rules={ruleItems}>
                    <InputNumber onChange={numberInputHandler} />
                </Form.Item>
            </div>
            <div className={serviceOrderStyles.orderParamItemRight} />
        </div>
    );
}
