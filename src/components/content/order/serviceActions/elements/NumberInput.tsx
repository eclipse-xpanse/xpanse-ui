import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, InputNumber, Tooltip } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { ServiceChangeParameter } from '../../../../../xpanse-api/generated';
import { DeployVariableSchema } from '../../types/DeployVariableSchema';

export function NumberInput({ actionParameter }: { actionParameter: ServiceChangeParameter }): React.JSX.Element {
    const ruleItems: Rule[] = [{ required: true }, { type: 'number' }];
    let minimum: number;
    let maximum: number;
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

    for (const key in actionParameter.valueSchema) {
        if (key === DeployVariableSchema.MINIMUM.valueOf()) {
            minimum = actionParameter.valueSchema[key] as number;
            ruleItems.push({ validator: setValidator });
            break;
        } else if (key === DeployVariableSchema.MAXIMUM.valueOf()) {
            maximum = actionParameter.valueSchema[key] as number;
            ruleItems.push({ validator: setValidator });
            break;
        }
    }
    return (
        <div className={serviceOrderStyles.orderParamItemRow}>
            <div className={serviceOrderStyles.orderParamItemContent}>
                <Form.Item
                    key={actionParameter.name}
                    name={actionParameter.name}
                    label={
                        <p
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                        >
                            <Tooltip placement='rightTop' title={actionParameter.description}>
                                {actionParameter.name}&nbsp;
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </p>
                    }
                    rules={ruleItems}
                    initialValue={Number(actionParameter.initialValue)}
                >
                    <InputNumber className={serviceOrderStyles.orderParamItemContent} />
                </Form.Item>
            </div>
            <div className={serviceOrderStyles.orderParamItemRight} />
        </div>
    );
}
