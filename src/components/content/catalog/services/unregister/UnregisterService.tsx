/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popconfirm } from 'antd';
import { ServiceVendorService } from '../../../../../xpanse-api/generated';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';

function UnregisterService({
    id,
    onConfirmHandler,
}: {
    id: string;
    onConfirmHandler: (message: string | Error, unregisterResult: boolean, id: string) => void;
}): React.JSX.Element {
    useQueryClient();
    const unregisterRequest = useMutation({
        mutationFn: () => {
            return ServiceVendorService.unregister(id);
        },
        onSuccess: () => {
            onConfirmHandler('Service Unregistered Successfully', true, id);
        },
        onError: (error: Error) => {
            onConfirmHandler(error, false, id);
        },
    });

    const unregister = () => {
        unregisterRequest.mutate();
    };

    return (
        <div className={'update-unregister-btn-class'}>
            <Popconfirm
                title='Unregister the service'
                description='Are you sure to unregister this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    unregister();
                }}
            >
                <Button
                    icon={<CloseCircleOutlined />}
                    type='primary'
                    className={'catalog-update-btn-class'}
                    disabled={unregisterRequest.isSuccess}
                >
                    Unregister
                </Button>
            </Popconfirm>
        </div>
    );
}

export default UnregisterService;
