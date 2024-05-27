/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
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
        <div className={catalogStyles.updateUnregisterBtnClass}>
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
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={unregisterRequest.isSuccess}
                >
                    Unregister
                </Button>
            </Popconfirm>
        </div>
    );
}

export default UnregisterService;
