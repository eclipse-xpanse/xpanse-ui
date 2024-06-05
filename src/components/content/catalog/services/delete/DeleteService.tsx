/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { useDeleteRequest } from './DeleteServiceMutation';

function DeleteService({
    id,
    setIsViewDisabled,
    isDeleteDisabled,
    setIsReRegisterDisabled,
    serviceRegistrationState,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    isDeleteDisabled: boolean;
    setIsReRegisterDisabled: (isReRegisterDisabled: boolean) => void;
    serviceRegistrationState: ServiceTemplateDetailVo.serviceRegistrationState;
}): React.JSX.Element {
    const deleteRequest = useDeleteRequest(id);
    if (deleteRequest.isSuccess) {
        setIsReRegisterDisabled(true);
    }

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
                        isDeleteDisabled ||
                        serviceRegistrationState !== ServiceTemplateDetailVo.serviceRegistrationState.UNREGISTERED
                    }
                >
                    Delete
                </Button>
            </Popconfirm>
        </div>
    );
}

export default DeleteService;
