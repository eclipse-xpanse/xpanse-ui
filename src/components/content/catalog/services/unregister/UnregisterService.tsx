/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popconfirm } from 'antd';
import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useUnregisterRequest } from './UnregisterMutation';

function UnregisterService({
    id,
    setIsViewDisabled,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
}): React.JSX.Element {
    const unregisterRequest = useUnregisterRequest(id);

    const unregister = () => {
        setIsViewDisabled(true);
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
