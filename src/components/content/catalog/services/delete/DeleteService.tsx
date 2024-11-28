/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { serviceTemplateRegistrationState } from '../../../../../xpanse-api/generated';
import { useGetReRegisterMutationState } from '../re-register/ReRegisterMutation';
import { useDeleteRequest } from './DeleteServiceMutation';

function DeleteService({
    id,
    setIsViewDisabled,
    serviceRegistrationStatus,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    serviceRegistrationStatus: serviceTemplateRegistrationState;
}): React.JSX.Element {
    const deleteRequest = useDeleteRequest(id);
    const reRegisterState = useGetReRegisterMutationState(id);

    const deleteService = () => {
        setIsViewDisabled(true);
        deleteRequest.mutate();
    };

    return (
        <div className={catalogStyles.updateUnregisterBtnClass}>
            <Popconfirm
                title='Delete the service'
                description='Are you sure to delete this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    deleteService();
                }}
            >
                <Button
                    icon={<CloseCircleOutlined />}
                    type='primary'
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={
                        deleteRequest.isSuccess ||
                        (reRegisterState.length > 0 && reRegisterState[0].status === 'success') ||
                        serviceRegistrationStatus !== serviceTemplateRegistrationState.IN_REVIEW
                    }
                >
                    Delete
                </Button>
            </Popconfirm>
        </div>
    );
}

export default DeleteService;
