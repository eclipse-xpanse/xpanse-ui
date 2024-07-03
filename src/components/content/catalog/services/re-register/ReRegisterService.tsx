/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { serviceRegistrationState } from '../../../../../xpanse-api/generated';
import { useGetDeleteMutationState } from '../delete/DeleteServiceMutation';
import { useReRegisterRequest } from './ReRegisterMutation';

function ReRegisterService({
    id,
    setIsViewDisabled,
    serviceRegistrationStatus,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    serviceRegistrationStatus: serviceRegistrationState;
}): React.JSX.Element {
    const reRegisterRequest = useReRegisterRequest(id);
    const deleteState = useGetDeleteMutationState(id);
    const reRegister = () => {
        setIsViewDisabled(true);
        reRegisterRequest.mutate();
    };

    return (
        <div className={catalogStyles.updateUnregisterBtnClass}>
            <Popconfirm
                title='re-register the service'
                description='Are you sure to re-register this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    reRegister();
                }}
            >
                <Button
                    icon={<PlusCircleOutlined />}
                    type='primary'
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={
                        reRegisterRequest.isSuccess ||
                        (deleteState.length > 0 && deleteState[0].status === 'success') ||
                        serviceRegistrationStatus !== serviceRegistrationState.UNREGISTERED
                    }
                >
                    Re-register
                </Button>
            </Popconfirm>
        </div>
    );
}

export default ReRegisterService;
