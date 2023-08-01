/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServiceProvider, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { OrderItem } from '../create/OrderSubmit';
import { DeployParam, getDeployParams, MigrationSteps, ParamOnChangeHandler } from '../formElements/CommonTypes';
import { ApiDoc } from '../../common/ApiDoc';
import { Button, Form, Input, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { ChangeEvent, useEffect, useState } from 'react';

export const ShowDeploy = ({
    userAvailableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    getCurrentMigrationStep,
    getDeployParameters,
    currentDeployParams,
}: {
    userAvailableServiceVoList: UserAvailableServiceVo[];
    selectCsp: CloudServiceProvider.name | undefined;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    getDeployParameters: (values: Record<string, never>) => void;
    currentDeployParams: Record<string, never> | undefined;
}): JSX.Element => {
    const [form] = Form.useForm();
    const props = getDeployParams(userAvailableServiceVoList, selectCsp, selectArea, selectRegion, selectFlavor);

    const [parameters, setParameters] = useState<DeployParam[]>(props.params);
    const [customerServiceName, setCustomerServiceName] = useState('');
    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(
        MigrationSteps.DeployServiceOnTheNewDestination
    );

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.SelectADestination);
    };

    useEffect(() => {
        getCurrentMigrationStep(currentMigrationStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStep]);

    useEffect(() => {
        if (currentDeployParams) {
            Object.keys(currentDeployParams).forEach(function (key) {
                if (key === 'Name') {
                    form.setFieldsValue({ Name: currentDeployParams[key] });
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDeployParams]);

    function GetOnChangeHandler(parameter: DeployParam): ParamOnChangeHandler {
        if (parameter.type === 'string') {
            return (event: ChangeEvent<HTMLInputElement>) => {
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: event.target.value };
                        }
                        return item;
                    })
                );
            };
        }
        if (parameter.type === 'number') {
            return (value: string | number | null) => {
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: value as string };
                        }
                        return item;
                    })
                );
            };
        }
        if (parameter.type === 'boolean') {
            return (checked: boolean) => {
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: checked ? 'true' : 'false' };
                        }
                        return item;
                    })
                );
            };
        }
        return (value: unknown) => {
            console.log(value);
        };
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCustomerServiceName(e.target.value);
    };

    const handleFinish = (values: Record<string, never>) => {
        getDeployParameters(values);
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    return (
        <div>
            <div className={'migrate-show-deploy-class'}>
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        <div className={'content-title-order'}>
                            <ApiDoc id={props.id} styleClass={'content-title-api'}></ApiDoc>
                        </div>
                    </div>
                </div>

                <div className={'order-param-item-left'} />
                <Form
                    layout='vertical'
                    autoComplete='off'
                    form={form}
                    onFinish={handleFinish}
                    validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                    key='deploy'
                >
                    <Form.Item
                        name={'Name'}
                        label={'Name: Service Name'}
                        rules={[{ required: true }, { type: 'string', min: 5 }]}
                        colon={true}
                    >
                        <Input
                            name={'Name'}
                            showCount
                            placeholder={'customer defined name for service ordered'}
                            maxLength={256}
                            className={'order-param-item-content'}
                            suffix={
                                <Tooltip title={'Customer defined name for the service instance created'}>
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            value={customerServiceName}
                            onChange={handleNameChange}
                        />
                    </Form.Item>
                    <div>
                        {parameters.map((item) =>
                            item.kind === 'variable' || item.kind === 'env' ? (
                                <OrderItem key={item.name} item={item} onChangeHandler={GetOnChangeHandler(item)} />
                            ) : (
                                <></>
                            )
                        )}
                    </div>
                    <Space size={'large'}>
                        {currentMigrationStep > MigrationSteps.ExportServiceData ? (
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                    type='primary'
                                    className={'migrate-steps-operation-button-clas'}
                                    onClick={() => prev()}
                                >
                                    Previous
                                </Button>
                            </Form.Item>
                        ) : (
                            <></>
                        )}
                        {currentMigrationStep < MigrationSteps.DestroyTheOldService ? (
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className={'migrate-steps-operation-button-clas'}
                                >
                                    Next
                                </Button>
                            </Form.Item>
                        ) : (
                            <></>
                        )}
                    </Space>
                </Form>
            </div>
        </div>
    );
};
