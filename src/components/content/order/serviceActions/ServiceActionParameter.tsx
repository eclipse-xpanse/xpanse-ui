/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import { Button, Form } from 'antd';
import React from 'react';
import '../../../../styles/app.module.css';
import {
    CreateServiceActionData,
    ServiceActionRequest,
    ServiceChangeParameter,
    ServiceOrder,
} from '../../../../xpanse-api/generated';
import { ServiceActionParameterItem } from './ServiceActionParameterItem';

export const ServiceActionParameter = ({
    serviceId,
    actionName,
    actionParameters,
    createServiceActionRequest,
}: {
    serviceId: string;
    actionName: string;
    actionParameters: ServiceChangeParameter[] | undefined;
    createServiceActionRequest: UseMutationResult<ServiceOrder, Error, CreateServiceActionData>;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const onSubmit = () => {
        const fieldsValues = form.getFieldsValue() as Record<string, string | number | undefined>;
        const actionParameters: Record<string, unknown> = {};
        Object.entries(fieldsValues).forEach(([key, value]) => {
            actionParameters[key] = value;
        });

        const request: ServiceActionRequest = {
            actionName: actionName,
            actionParameters: actionParameters,
        };
        const data: CreateServiceActionData = {
            serviceId: serviceId,
            requestBody: request,
        };
        createServiceActionRequest.mutate(data);
    };

    return actionParameters ? (
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
    ) : (
        <></>
    );
};
