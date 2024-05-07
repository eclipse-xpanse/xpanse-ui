/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useRef } from 'react';
import { Button, Form, Space, Switch } from 'antd';
import '../../../../styles/locks.css';
import {
    ApiError,
    DeployedServiceDetails,
    Response,
    ServiceLockConfig,
    ServiceService,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';
import { useMutation } from '@tanstack/react-query';
import LocksResult from './LocksResult';

export const Locks = ({
    currentSelectedService,
}: {
    currentSelectedService: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
}): React.JSX.Element => {
    const [form] = Form.useForm();
    const requestResult = useRef<string[]>([]);

    const lockRequest = useMutation({
        mutationFn: (requestBody: { id: string; lockConfig: ServiceLockConfig }) => {
            return ServiceService.changeServiceLockConfig(requestBody.id, requestBody.lockConfig);
        },
        onSuccess: () => {
            requestResult.current = [];
        },
        onError: (error: Error) => {
            if (error instanceof ApiError && error.body && 'details' in error.body) {
                const response: Response = error.body as Response;
                requestResult.current = response.details;
            } else {
                requestResult.current = [error.message];
            }
        },
    });

    const onFinish = (values: { destroyChecked: boolean; modifyChecked: boolean }) => {
        const serviceLockConfig: { id: string; lockConfig: ServiceLockConfig } = {
            id: currentSelectedService.id,
            lockConfig: {
                destroyLocked: values.destroyChecked,
                modifyLocked: values.modifyChecked,
            },
        };
        lockRequest.mutate(serviceLockConfig);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className={'locks-select-class'}>
            {currentSelectedService.lockConfig !== undefined && !lockRequest.isPending && !lockRequest.isIdle ? (
                <LocksResult
                    currentSelectedService={currentSelectedService}
                    lockRequestStatus={lockRequest.status}
                    requestResult={requestResult.current}
                />
            ) : null}
            <div className={'locks-param-item-left'} />
            <Form
                form={form}
                layout='horizontal'
                initialValues={{
                    destroyChecked:
                        currentSelectedService.lockConfig !== undefined
                            ? currentSelectedService.lockConfig.destroyLocked
                            : false,
                    modifyChecked:
                        currentSelectedService.lockConfig !== undefined
                            ? currentSelectedService.lockConfig.modifyLocked
                            : false,
                }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                disabled={lockRequest.isSuccess}
            >
                <Form.Item label='Destroy Lock:' name='destroyChecked' valuePropName='destroyChecked'>
                    <Switch
                        defaultValue={
                            currentSelectedService.lockConfig !== undefined
                                ? currentSelectedService.lockConfig.destroyLocked
                                : false
                        }
                    />
                </Form.Item>
                <Form.Item label='Modify Lock:' name='modifyChecked' valuePropName='modifyChecked'>
                    <Switch
                        defaultValue={
                            currentSelectedService.lockConfig !== undefined
                                ? currentSelectedService.lockConfig.modifyLocked
                                : false
                        }
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit' loading={lockRequest.isPending}>
                            Submit
                        </Button>
                        <Button htmlType='button' onClick={onReset}>
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};
