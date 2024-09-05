/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React, { ChangeEvent, useState } from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { csp, deployResourceKind, Region, sensitiveScope } from '../../../../xpanse-api/generated';
import useAutoFillDeployVariableQuery from '../create/useAutoFillDeployVariableQuery';
import { useOrderFormStore } from '../store/OrderFormStore';
import { DeployParam } from '../types/DeployParam';
import { DeployVariableSchema } from '../types/DeployVariableSchema';

export function TextInput({ item, csp, region }: { item: DeployParam; csp: csp; region: Region }): React.JSX.Element {
    const [isExistingResourceDropDownDisabled, setIsExistingResourceDropDownDisabled] = useState<boolean>(false);
    const ruleItems: Rule[] = [{ required: item.mandatory }, { type: 'string' }];
    let regExp: RegExp;
    let valueList: string[] = [];
    let isEnum: boolean = false;
    let autoFillDeployVariableList: string[] = [];
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    const autoFillDeployVariableRequest = useAutoFillDeployVariableQuery(
        csp,
        region.site,
        region.name,
        item.autoFill ? (item.autoFill.deployResourceKind as deployResourceKind) : deployResourceKind.VM
    );

    if (autoFillDeployVariableRequest.isSuccess) {
        autoFillDeployVariableList = autoFillDeployVariableRequest.data;
    }

    const getStringEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        cacheFormVariable(event.target.name, event.target.value);
    };

    const getEventEventHandler = (event: string) => {
        cacheFormVariable(item.name, event);
    };

    const createVariable = () => {
        setIsExistingResourceDropDownDisabled(true);
    };

    const selectVariable = () => {
        setIsExistingResourceDropDownDisabled(false);
    };

    for (const key in item.valueSchema) {
        if (key === DeployVariableSchema.ENUM.valueOf()) {
            isEnum = true;
            valueList = item.valueSchema[key] as string[];
        } else if (key === DeployVariableSchema.MINLENGTH.valueOf()) {
            ruleItems.push({ min: item.valueSchema[key] as number });
        } else if (key === DeployVariableSchema.MAXLENGTH.valueOf()) {
            ruleItems.push({ max: item.valueSchema[key] as number });
        } else if (key === DeployVariableSchema.PATTERN.valueOf()) {
            regExp = new RegExp(item.valueSchema[key] as string);
            ruleItems.push({ pattern: regExp });
        }
    }

    return (
        <div className={serviceOrderStyles.orderParamItemRow}>
            <div className={serviceOrderStyles.orderParamItemLeft} />
            <div className={serviceOrderStyles.orderParamItemContent}>
                <Form.Item name={item.name} label={item.name + ' :  ' + item.description} rules={ruleItems}>
                    {item.sensitiveScope === sensitiveScope.ALWAYS.toString() ||
                    item.sensitiveScope === sensitiveScope.ONCE.toString() ? (
                        <Input.Password
                            name={item.name}
                            placeholder={item.example}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={getStringEventHandler}
                        />
                    ) : isEnum ? (
                        <Select onChange={getEventEventHandler} size='large'>
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
                    ) : item.autoFill === undefined ? (
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
                    ) : item.autoFill.isAllowCreate ? (
                        <div>
                            <Row>
                                <Col span={10}>
                                    <Select
                                        disabled={isExistingResourceDropDownDisabled}
                                        allowClear
                                        showSearch
                                        optionFilterProp='label'
                                        onChange={getEventEventHandler}
                                    >
                                        {autoFillDeployVariableList.map((variableName) => (
                                            <Select.Option
                                                key={variableName}
                                                value={variableName}
                                                className={serviceOrderStyles.orderDeploySelectOption}
                                            >
                                                {variableName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                {isExistingResourceDropDownDisabled ? (
                                    <>
                                        <Col span={1}></Col>
                                        <Col span={9}>
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
                                        </Col>
                                    </>
                                ) : undefined}
                                <Col span={4}>
                                    {isExistingResourceDropDownDisabled ? (
                                        <Button type={'link'} onClick={selectVariable}>
                                            select existing
                                        </Button>
                                    ) : (
                                        <Button type={'link'} onClick={createVariable}>
                                            create new
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <Select allowClear showSearch optionFilterProp='label' onChange={getEventEventHandler}>
                            {autoFillDeployVariableList.map((variableName) => (
                                <Select.Option
                                    key={variableName}
                                    value={variableName}
                                    className={serviceOrderStyles.orderDeploySelectOption}
                                >
                                    {variableName}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            </div>
            <div className={serviceOrderStyles.orderParamItemRight} />
        </div>
    );
}
