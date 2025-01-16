/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, StepProps, Tooltip } from 'antd';
import React, { useState } from 'react';
import appStyles from '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import tableStyles from '../../../../styles/table.module.css';
import {
    DeployRequest,
    Region,
    UserOrderableServiceVo,
    billingMode,
    csp,
    serviceHostingType,
} from '../../../../xpanse-api/generated';
import { CUSTOMER_SERVICE_NAME_FIELD } from '../../../utils/constants';
import { ApiDoc } from '../../common/doc/ApiDoc';
import { EulaInfo } from '../common/EulaInfo';
import { OrderItem } from '../common/utils/OrderItem';
import { getDeployParams } from '../formDataHelpers/deployParamsHelper';
import { getEulaByCsp } from '../formDataHelpers/eulaHelper';
import { useOrderFormStore } from '../store/OrderFormStore';
import { ServicePortingSteps } from '../types/ServicePortingSteps.ts';

export const DeploymentForm = ({
    userOrderableServiceVoList,
    selectCsp,
    selectServiceHostingType,
    region,
    availabilityZones,
    selectFlavor,
    selectBillingMode,
    setCurrentPortingStep,
    setDeployParameters,
    stepItem,
}: {
    userOrderableServiceVoList: UserOrderableServiceVo[];
    selectCsp: csp;
    selectServiceHostingType: serviceHostingType;
    region: Region;
    availabilityZones: Record<string, string>;
    selectFlavor: string;
    selectBillingMode: billingMode;
    setCurrentPortingStep: (currentMigrationStep: ServicePortingSteps) => void;
    setDeployParameters: (createRequest: DeployRequest) => void;
    stepItem: StepProps;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const [isEulaAccepted, setIsEulaAccepted] = useState<boolean>(false);
    const currentEula: string | undefined = getEulaByCsp(selectCsp, userOrderableServiceVoList);
    const deployParams = getDeployParams(
        userOrderableServiceVoList,
        selectCsp,
        selectServiceHostingType,
        region,
        selectFlavor,
        undefined,
        availabilityZones,
        currentEula,
        selectBillingMode
    );
    const [cacheFormVariable] = useOrderFormStore((state) => [state.addDeployVariable]);

    const prev = () => {
        setCurrentPortingStep(ServicePortingSteps.SelectADestination);
    };

    const handleFinish = () => {
        const createRequest: DeployRequest = {
            category: deployParams.category,
            csp: deployParams.csp,
            flavor: deployParams.flavor,
            region: region,
            serviceName: deployParams.name,
            version: deployParams.version,
            customerServiceName: useOrderFormStore.getState().deployParams.Name as string,
            serviceHostingType: deployParams.serviceHostingType,
            availabilityZones: deployParams.availabilityZones,
            eulaAccepted: isEulaAccepted,
            billingMode: selectBillingMode,
        };
        const serviceRequestProperties: Record<string, unknown> = {};
        for (const variable in useOrderFormStore.getState().deployParams) {
            if (
                variable !== CUSTOMER_SERVICE_NAME_FIELD &&
                useOrderFormStore.getState().deployParams[variable] !== ''
            ) {
                serviceRequestProperties[variable] = useOrderFormStore.getState().deployParams[variable];
            }
        }
        createRequest.serviceRequestProperties = serviceRequestProperties;
        setDeployParameters(createRequest);
        stepItem.status = 'finish';
        setCurrentPortingStep(ServicePortingSteps.ImportServiceData);
    };

    return (
        <div>
            <div className={serviceOrderStyles.portingShowDeployClass}>
                <div className={tableStyles.genericTableContainer}>
                    <div className={appStyles.contentTitle}>
                        <div>
                            <ApiDoc
                                serviceTemplateId={deployParams.id}
                                styleClass={serviceOrderStyles.contentTitleApi}
                            ></ApiDoc>
                        </div>
                    </div>
                </div>
                <div className={serviceOrderStyles.orderParamItemLeft} />
                <Form
                    layout='vertical'
                    autoComplete='off'
                    form={form}
                    initialValues={useOrderFormStore.getState().deployParams}
                    onFinish={handleFinish}
                    validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                    key='deploy'
                >
                    <div className={serviceOrderStyles.orderFormGroupItems}>
                        <div className={serviceOrderStyles.orderParamItemLeft} />
                        <Form.Item
                            name={'Name'}
                            label={'Name: Service Name'}
                            rules={[{ required: true }, { type: 'string', min: 5 }]}
                            colon={true}
                            className={serviceOrderStyles.orderParamsFirstParam}
                        >
                            <Input
                                name={'Name'}
                                showCount
                                placeholder={'customer defined name for service ordered'}
                                maxLength={256}
                                className={serviceOrderStyles.orderParamItemContent}
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
                                    <OrderItem key={item.name} item={item} csp={selectCsp} region={region} />
                                ) : undefined
                            )}
                        </div>
                    </div>
                    <div className={serviceOrderStyles.orderParamsFirstParam} />
                    <div className={serviceOrderStyles.orderParamItemRow}>
                        <div className={serviceOrderStyles.orderParamItemLeft} />
                        <div className={serviceOrderStyles.orderParamItemContent}>
                            <EulaInfo
                                eula={currentEula}
                                isEulaAccepted={isEulaAccepted}
                                setIsEulaAccepted={setIsEulaAccepted}
                            />
                        </div>
                    </div>
                    <Space size={'large'}>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                                type='primary'
                                onClick={() => {
                                    prev();
                                }}
                            >
                                Previous
                            </Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type='primary' htmlType='submit'>
                                Next
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </div>
    );
};
