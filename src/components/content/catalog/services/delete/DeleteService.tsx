/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';
import { useDeleteRequest } from './DeleteServiceMutation';

function DeleteService({
    serviceDetail,
    setIsViewDisabled,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
}): React.JSX.Element {
    const deleteRequest = useDeleteRequest(serviceDetail.serviceTemplateId);
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
                    icon={<DeleteOutlined />}
                    type='primary'
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={deleteRequest.isSuccess || serviceDetail.isAvailableInCatalog}
                >
                    Delete
                </Button>
            </Popconfirm>
        </div>
    );
}

export default DeleteService;
