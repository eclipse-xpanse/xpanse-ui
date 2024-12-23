/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { useDeleteRequest } from './DeleteServiceMutation';

function DeleteService({
    id,
    setIsViewDisabled,
    isAvailableInCatalog,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    isAvailableInCatalog: boolean;
}): React.JSX.Element {
    const deleteRequest = useDeleteRequest(id);
    const deleteService = () => {
        setIsViewDisabled(true);
        deleteRequest.mutate();
    };

    return (
        <div className={catalogStyles.updateUnpublishBtnClass}>
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
                    disabled={deleteRequest.isSuccess || isAvailableInCatalog}
                >
                    Delete
                </Button>
            </Popconfirm>
        </div>
    );
}

export default DeleteService;
