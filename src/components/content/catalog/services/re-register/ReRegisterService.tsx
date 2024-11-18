/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo, serviceTemplateRegistrationState } from '../../../../../xpanse-api/generated';
import { useGetDeleteMutationState } from '../delete/DeleteServiceMutation';

function ReRegisterService({
    id,
    setIsViewDisabled,
    reRegisterRequest,
    serviceRegistrationStatus,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    reRegisterRequest: UseMutationResult<ServiceTemplateDetailVo, Error, void>;
    serviceRegistrationStatus: serviceTemplateRegistrationState;
}): React.JSX.Element {
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
                        serviceRegistrationStatus !== serviceTemplateRegistrationState.IN_PROGRESS
                    }
                >
                    Re-register
                </Button>
            </Popconfirm>
        </div>
    );
}

export default ReRegisterService;
