/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import { Button, Empty, Form } from 'antd';
import React, { useState } from 'react';
import '../../../../styles/app.module.css';
import {
    CreateServiceActionData,
    Options,
    OrderStatus,
    ServiceActionRequest,
    ServiceChangeParameter,
    ServiceHostingType,
    ServiceOrder,
} from '../../../../xpanse-api/generated';
import { useLatestServiceOrderStatusQuery } from '../../common/queries/useLatestServiceOrderStatusQuery.ts';
import { ServiceActionParameterItem } from './ServiceActionParameterItem';
import ServiceActionStatusAlert from './ServiceActionStatusAlert.tsx';

export const ServiceActionParameter = ({
    serviceId,
    serviceHostType,
    actionName,
    actionParameters,
    createServiceActionRequest,
}: {
    serviceId: string;
    serviceHostType: ServiceHostingType;
    actionName: string;
    actionParameters: ServiceChangeParameter[] | undefined;
    createServiceActionRequest: UseMutationResult<ServiceOrder | undefined, Error, Options<CreateServiceActionData>>;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const [isShowActionSubmitResult, setIsShowActionSubmitResult] = useState<boolean>(false);

    const getServiceActionsStatusPollingQuery = useLatestServiceOrderStatusQuery(
        createServiceActionRequest.data?.orderId ?? '',
        createServiceActionRequest.isSuccess,
        [OrderStatus.SUCCESSFUL, OrderStatus.FAILED],
        isShowActionSubmitResult
    );
    const onSubmit = () => {
        setIsShowActionSubmitResult(true);
        const fieldsValues = form.getFieldsValue() as Record<string, string | number | undefined>;
        const actionParameters: Record<string, unknown> = {};
        Object.entries(fieldsValues).forEach(([key, value]) => {
            actionParameters[key] = value;
        });

        const request: ServiceActionRequest = {
            actionName: actionName,
            actionParameters: actionParameters,
        };
        const data: Options<CreateServiceActionData> = {
            path: {
                serviceId: serviceId,
            },
            body: request,
        };
        createServiceActionRequest.mutate(data);
    };

    if (actionParameters === undefined || actionParameters.length === 0) {
        return <Empty />;
    }

    return (
        <>
            {isShowActionSubmitResult ? (
                <ServiceActionStatusAlert
                    key={serviceId}
                    serviceId={serviceId}
                    serviceHostType={serviceHostType}
                    createServiceActionRequest={createServiceActionRequest}
                    getServiceActionStatusPollingQuery={getServiceActionsStatusPollingQuery}
                    actionName={actionName}
                />
            ) : null}
            <Form
                form={form}
                layout='vertical'
                onFinish={onSubmit}
                autoComplete='off'
                validateTrigger={['onSubmit']}
                key='createServiceAction'
                disabled={createServiceActionRequest.isSuccess}
            >
                {actionParameters.map((actionParameter) => (
                    <ServiceActionParameterItem key={actionParameter.name} actionParameter={actionParameter} />
                ))}
                <div>
                    <Button type='primary' loading={createServiceActionRequest.isPending} htmlType='submit'>
                        submit
                    </Button>
                </div>
            </Form>
        </>
    );
};
