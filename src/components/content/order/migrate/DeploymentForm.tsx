/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployRequest, Region, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { ApiDoc } from '../../common/doc/ApiDoc';
import { Button, Form, Input, Space, StepProps, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { useOrderFormStore } from '../store/OrderFormStore';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import { MigrationSteps } from '../types/MigrationSteps';
import { OrderItem } from '../common/utils/OrderItem';

export const DeploymentForm = ({
    userOrderableServiceVoList,
    selectCsp,
    selectServiceHostingType,
    region,
    availabilityZones,
    selectFlavor,
    setCurrentMigrationStep,
    setDeployParameters,
    stepItem,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: UserOrderableServiceVo.csp;
    selectServiceHostingType: UserOrderableServiceVo.serviceHostingType;
    region: Region;
    availabilityZones: Record<string, string>;
    selectFlavor: string;
    setCurrentMigrationStep: (currentMigrationStep: MigrationSteps) => void;
    setDeployParameters: (createRequest: DeployRequest) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const deployParams = getDeployParams(
        userOrderableServiceVoList,
        selectCsp,
        selectServiceHostingType,
        region,
        selectFlavor,
        undefined,
        availabilityZones
    );
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);
    const deployParamsRef = useRef(useOrderFormStore.getState().deployParams);

    const prev = () => {
        setCurrentMigrationStep(MigrationSteps.SelectADestination);
    };

    const handleFinish = () => {
        const createRequest: DeployRequest = {
            category: deployParams.category,
            csp: deployParams.csp,
            flavor: deployParams.flavor,
            region: region,
            serviceName: deployParams.name,
            version: deployParams.version,
            customerServiceName: deployParamsRef.current.Name as string,
            serviceHostingType: deployParams.serviceHostingType,
            availabilityZones: deployParams.availabilityZones,
        };
        const serviceRequestProperties: Record<string, unknown> = {};
        for (const variable in deployParamsRef.current) {
            if (variable !== CUSTOMER_SERVICE_NAME_FIELD && deployParamsRef.current[variable] !== '') {
                serviceRequestProperties[variable] = deployParamsRef.current[variable];
            }
        }
        createRequest.serviceRequestProperties = serviceRequestProperties;
        setDeployParameters(createRequest);
        stepItem.status = 'finish';
        setCurrentMigrationStep(MigrationSteps.ImportServiceData);
    };

    return (
        <div>
            <div className={'migrate-show-deploy-class'}>
                <div className={'generic-table-container'}>
                    <div className={'content-title'}>
                        <div className={'content-title-order'}>
                            <ApiDoc id={deployParams.id} styleClass={'content-title-api'}></ApiDoc>
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
                        {deployParams.params.map((item) =>
                            item.kind === 'variable' || item.kind === 'env' ? (
                                <OrderItem key={item.name} item={item} csp={selectCsp} region={region.name} />
                            ) : undefined
                        )}
                    </div>
                    <Space size={'large'}>
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
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type='primary' htmlType='submit' className={'migrate-steps-operation-button-clas'}>
                                Next
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </div>
    );
};
