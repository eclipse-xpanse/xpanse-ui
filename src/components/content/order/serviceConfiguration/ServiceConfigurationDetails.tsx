/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Popconfirm, Row, Skeleton } from 'antd';
import React, { useState } from 'react';
import '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import {
    type ChangeServiceConfigurationData,
    DeployedServiceDetails,
    orderStatus,
    ServiceConfigurationUpdate,
    serviceHostingType,
    UserOrderableServiceVo,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { useLatestServiceOrderStatusQuery } from '../../common/queries/useLatestServiceOrderStatusQuery.ts';
import { ServiceConfigParameterItem } from './ServiceConfigParameterItem.tsx';
import ServiceConfigStatusAlert from './ServiceConfigStatusAlert.tsx';
import useGetCurrentConfigurationOfServiceQuery from './useGetConfigurationOfServiceQuery.ts';
import { useUpdateServiceConfigurationRequest } from './useUpdateServiceConfigurationRequest.ts';

export const ServiceConfigurationDetails = ({
    userOrderableServiceVo,
    deployedService,
}: {
    deployedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    userOrderableServiceVo: UserOrderableServiceVo | undefined;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const [isUpdateConfig, setIsUpdateConfig] = useState<boolean>(false);
    const [isShowUpdateConfigResult, setIsShowUpdateConfigResult] = useState<boolean>(false);

    const getCurrentConfigurationOfServiceQuery = useGetCurrentConfigurationOfServiceQuery(deployedService.serviceId);

    const updateConfigRequest = useUpdateServiceConfigurationRequest();

    const getUpdateConfigStatusPollingQuery = useLatestServiceOrderStatusQuery(
        updateConfigRequest.data?.orderId ?? '',
        updateConfigRequest.isSuccess,
        [orderStatus.SUCCESSFUL, orderStatus.FAILED]
    );

    const updateConfig = (values: ServiceConfigurationUpdate) => {
        setIsShowUpdateConfigResult(true);
        const data: ChangeServiceConfigurationData = {
            requestBody: { configuration: values },
            serviceId: deployedService.serviceId,
        };
        updateConfigRequest.mutate(data);
    };

    const initialValues = React.useMemo(() => {
        const config = getCurrentConfigurationOfServiceQuery.data?.configuration ?? {};
        const numericKeys =
            userOrderableServiceVo?.configurationParameters
                ?.filter((param) => param.dataType === 'number')
                .map((param) => param.name) ?? [];

        const numericConfig = Object.keys(config).reduce<Record<string, unknown>>((acc, key) => {
            if (numericKeys.includes(key)) {
                acc[key] = Number(config[key]) || 0;
            } else {
                acc[key] = config[key];
            }
            return acc;
        }, {});

        return {
            ...numericConfig,
            updatedTime: getCurrentConfigurationOfServiceQuery.data?.updatedTime,
        };
    }, [getCurrentConfigurationOfServiceQuery.data, userOrderableServiceVo]);

    if (getCurrentConfigurationOfServiceQuery.isLoading || getCurrentConfigurationOfServiceQuery.isPending) {
        return <Skeleton active />;
    }

    if (!userOrderableServiceVo || !getCurrentConfigurationOfServiceQuery.data) {
        return <Empty />;
    }

    return (
        <>
            <div className={serviceOrderStyles.serviceConfigContainer}>
                {isShowUpdateConfigResult ? (
                    <ServiceConfigStatusAlert
                        key={deployedService.serviceId}
                        serviceId={deployedService.serviceId}
                        serviceHostType={deployedService.serviceHostingType as serviceHostingType}
                        updateConfigRequest={updateConfigRequest}
                        getUpdateConfigStatusPollingQuery={getUpdateConfigStatusPollingQuery}
                    />
                ) : null}
                <Form
                    form={form}
                    key={'serviceConfiguration'}
                    layout='vertical'
                    disabled={!isUpdateConfig}
                    className={serviceOrderStyles.orderFormInlineDisplay}
                    initialValues={initialValues}
                >
                    <div className={serviceOrderStyles.orderParamItemRow}>
                        <div className={serviceOrderStyles.orderParamItemContent}>
                            <Form.Item
                                key={getCurrentConfigurationOfServiceQuery.data.updatedTime}
                                label={'config last updated at:'}
                                initialValue={getCurrentConfigurationOfServiceQuery.data.updatedTime}
                            >
                                <Input value={getCurrentConfigurationOfServiceQuery.data.updatedTime} disabled={true} />
                            </Form.Item>
                        </div>
                    </div>
                    {getCurrentConfigurationOfServiceQuery.data.configuration ? (
                        Object.entries(getCurrentConfigurationOfServiceQuery.data.configuration).map(([key]) => (
                            <div key={key}>
                                <ServiceConfigParameterItem
                                    configParameter={userOrderableServiceVo.configurationParameters?.find(
                                        (param) => param.name === key
                                    )}
                                />
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                    <Row justify='space-around'>
                        <div className={serviceOrderStyles.serviceConfigUpdate}>
                            <>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        setIsUpdateConfig(true);
                                    }}
                                    disabled={
                                        isUpdateConfig ||
                                        updateConfigRequest.isPending ||
                                        updateConfigRequest.isSuccess ||
                                        getUpdateConfigStatusPollingQuery.isSuccess
                                    }
                                >
                                    <EditOutlined /> Update
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Popconfirm
                                    title='Update current config'
                                    description='Are you sure to update current config?'
                                    cancelText='Yes'
                                    okText='No'
                                    onCancel={() => {
                                        form.validateFields()
                                            .then((values: ServiceConfigurationUpdate) => {
                                                updateConfig(values);
                                                setIsUpdateConfig(false);
                                            })
                                            .catch((errorInfo: unknown) => {
                                                return errorInfo;
                                            });
                                    }}
                                >
                                    <Button type='primary' htmlType='submit' disabled={!isUpdateConfig}>
                                        <CheckCircleOutlined /> Submit
                                    </Button>
                                </Popconfirm>
                                &nbsp;&nbsp;&nbsp;
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        form.resetFields();
                                        setIsUpdateConfig(false);
                                    }}
                                    disabled={!isUpdateConfig}
                                >
                                    <CloseCircleOutlined /> Cancel
                                </Button>
                            </>
                        </div>
                    </Row>
                </Form>
            </div>
        </>
    );
};
