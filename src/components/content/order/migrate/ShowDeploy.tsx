/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CreateRequest, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { OrderItem } from '../create/OrderSubmit';
import { DeployParam, getDeployParams, MigrationSteps, ParamOnChangeHandler } from '../formElements/CommonTypes';
import { ApiDoc } from '../../common/doc/ApiDoc';
import { Button, Form, Input, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useOrderFormStore } from '../store/OrderFormStore';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';

export const ShowDeploy = ({
    userAvailableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    getCurrentMigrationStep,
    getDeployParameters,
}: {
    userAvailableServiceVoList: UserAvailableServiceVo[];
    selectCsp: string;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
    getCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    getDeployParameters: (createRequest: CreateRequest) => void;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const props = getDeployParams(userAvailableServiceVoList, selectCsp, selectArea, selectRegion, selectFlavor);

    const [currentMigrationStep, setCurrentMigrationStep] = useState<MigrationSteps>(
        MigrationSteps.DeployServiceOnTheNewDestination
    );
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const deployParamsRef = useRef(useOrderFormStore.getState().deployParams);
    useEffect(() => useOrderFormStore.subscribe((state) => (deployParamsRef.current = state.deployParams)), []);

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.SelectADestination);
    };

    useEffect(() => {
        getCurrentMigrationStep(currentMigrationStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMigrationStep]);

    function GetOnChangeHandler(parameter: DeployParam): ParamOnChangeHandler {
        if (parameter.type === 'string') {
            return (event: ChangeEvent<HTMLInputElement>) => {
                cacheFormVariable(event.target.name, event.target.value);
            };
        }
        if (parameter.type === 'number') {
            return (value: string | number | null) => {
                cacheFormVariable(parameter.name, value as string);
            };
        }
        if (parameter.type === 'boolean') {
            return (checked: boolean) => {
                cacheFormVariable(parameter.name, checked ? 'true' : 'false');
            };
        }
        return (event: ChangeEvent<HTMLInputElement>) => {
            cacheFormVariable(event.target.name, event.target.value);
        };
    }

    const handleFinish = () => {
        const createRequest: CreateRequest = {
            category: props.category,
            csp: props.csp,
            flavor: props.flavor,
            region: props.region,
            serviceName: props.name,
            version: props.version,
            customerServiceName: deployParamsRef.current.Name,
        };
        const serviceRequestProperties: Record<string, string> = {};
        for (const variable in deployParamsRef.current) {
            if (variable !== CUSTOMER_SERVICE_NAME_FIELD && deployParamsRef.current[variable] !== '') {
                serviceRequestProperties[variable] = deployParamsRef.current[variable];
            }
        }
        createRequest.serviceRequestProperties = serviceRequestProperties;
        getDeployParameters(createRequest);
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
                    initialValues={deployParamsRef.current}
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
                            onChange={(e) => {
                                cacheFormVariable(CUSTOMER_SERVICE_NAME_FIELD, String(e.target.value));
                            }}
                        />
                    </Form.Item>
                    <div>
                        {props.params.map((item) =>
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
                                    onClick={() => {
                                        prev();
                                    }}
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
