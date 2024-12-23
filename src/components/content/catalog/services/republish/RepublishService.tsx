/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { serviceTemplateRegistrationState, ServiceTemplateRequestInfo } from '../../../../../xpanse-api/generated';

import { useGetDeleteMutationState } from '../delete/DeleteServiceMutation';

function RepublishService({
    id,
    setIsViewDisabled,
    republishRequest,
    serviceRegistrationStatus,
    isReviewInProgress,
    isAvailableInCatalog,
}: {
    id: string;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    republishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
    serviceRegistrationStatus: serviceTemplateRegistrationState;
    isReviewInProgress: boolean;
    isAvailableInCatalog: boolean;
}): React.JSX.Element {
    const deleteState = useGetDeleteMutationState(id);
    const republish = () => {
        setIsViewDisabled(true);
        republishRequest.mutate();
    };

    return (
        <div className={catalogStyles.updateUnpublishBtnClass}>
            <Popconfirm
                title='republish the service'
                description='Are you sure to republish this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    republish();
                }}
            >
                <Button
                    icon={<PlusCircleOutlined />}
                    type='primary'
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={
                        republishRequest.isSuccess ||
                        (deleteState.length > 0 && deleteState[0].status === 'success') ||
                        serviceRegistrationStatus !== serviceTemplateRegistrationState.APPROVED ||
                        isReviewInProgress ||
                        isAvailableInCatalog
                    }
                >
                    Republish
                </Button>
            </Popconfirm>
        </div>
    );
}

export default RepublishService;
