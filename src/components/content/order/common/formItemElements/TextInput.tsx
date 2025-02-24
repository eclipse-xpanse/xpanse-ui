import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tooltip } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { sensitiveScope, ServiceChangeParameter } from '../../../../../xpanse-api/generated';
import { DeployVariableSchema } from '../../types/DeployVariableSchema.ts';

export function TextInput({ actionParameter }: { actionParameter: ServiceChangeParameter }): React.JSX.Element {
    let regExp: RegExp;
    let isEnum: boolean = false;
    let valueList: string[] = [];

    const ruleItems: Rule[] = [{ required: true }, { type: 'string' }];

    for (const key in actionParameter.valueSchema) {
        if (key === DeployVariableSchema.ENUM.valueOf()) {
            isEnum = true;
            valueList = actionParameter.valueSchema[key] as string[];
        } else if (key === DeployVariableSchema.MINLENGTH.valueOf()) {
            ruleItems.push({ min: actionParameter.valueSchema[key] as number });
        } else if (key === DeployVariableSchema.MAXLENGTH.valueOf()) {
            ruleItems.push({ max: actionParameter.valueSchema[key] as number });
        } else if (key === DeployVariableSchema.PATTERN.valueOf()) {
            regExp = new RegExp(actionParameter.valueSchema[key] as string);
            ruleItems.push({ pattern: regExp });
        }
    }

    return (
        <div className={serviceOrderStyles.orderParamItemRow}>
            <div className={serviceOrderStyles.orderParamItemContent}>
                <Form.Item
                    key={actionParameter.name}
                    name={actionParameter.name}
                    label={
                        <Tooltip placement='rightTop' title={actionParameter.description}>
                            {actionParameter.name}&nbsp;
                            <QuestionCircleOutlined />
                        </Tooltip>
                    }
                    rules={ruleItems}
                    initialValue={actionParameter.initialValue}
                >
                    {actionParameter.sensitiveScope === sensitiveScope.ALWAYS.toString() ||
                    actionParameter.sensitiveScope === sensitiveScope.ONCE.toString() ? (
                        <Input.Password
                            name={actionParameter.name}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    ) : isEnum ? (
                        <Select size='large'>
                            {valueList.map((value) => (
                                <Select.Option
                                    key={value}
                                    value={value}
                                    className={serviceOrderStyles.orderDeploySelectOption}
                                >
                                    {value}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            name={actionParameter.name}
                            suffix={
                                <Tooltip title={actionParameter.description}>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    )}
                </Form.Item>
            </div>
            <div className={serviceOrderStyles.orderParamItemRight} />
        </div>
    );
}
