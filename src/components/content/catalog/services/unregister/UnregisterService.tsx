/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popconfirm } from 'antd';
import { ServiceVendorService } from '../../../../../xpanse-api/generated';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

function UnregisterService({
    id,
    onConfirmHandler,
}: {
    id: string;
    onConfirmHandler: (message: string, unregisterResult: boolean, id: string) => void;
}): React.JSX.Element {
    const unregisterRequest = useMutation({
        mutationFn: () => {
            return ServiceVendorService.unregister(id);
        },
        onSuccess: () => {
            onConfirmHandler('Service Unregistered Successfully', true, id);
        },
        onError: (error: Error) => {
            onConfirmHandler('Service Unregister Failed, '.concat(error.message), false, id);
        },
    });

    return (
        <div className={'update-unregister-btn-class'}>
            <Popconfirm
                title='Unregister the service'
                description='Are you sure to unregister this service?'
                okText='Yes'
                cancelText='No'
                onConfirm={() => {
                    unregisterRequest.mutate();
                }}
            >
                <Button
                    type='primary'
                    style={{ marginLeft: '50px', marginTop: '20px' }}
                    disabled={unregisterRequest.isSuccess}
                >
                    Unregister
                </Button>
            </Popconfirm>
        </div>
    );
}
export default UnregisterService;
