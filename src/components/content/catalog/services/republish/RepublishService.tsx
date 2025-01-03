/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import {
    category,
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
    ServiceTemplateRequestInfo,
} from '../../../../../xpanse-api/generated';

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useGetDeleteMutationState } from '../delete/DeleteServiceMutation';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

function RepublishService({
    category,
    serviceDetail,
    setIsViewDisabled,
    republishRequest,
}: {
    category: category;
    serviceDetail: ServiceTemplateDetailVo;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    republishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
}): React.JSX.Element {
    const deleteState = useGetDeleteMutationState(serviceDetail.serviceTemplateId);
    const queryClient = useQueryClient();

    const republish = () => {
        setIsViewDisabled(true);
        republishRequest.mutate(undefined, {
            onSuccess: () => {
                void queryClient.invalidateQueries({ queryKey: getQueryKey(category) });
            },
            onSettled: () => {
                setIsViewDisabled(false);
            },
        });
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
                        serviceDetail.serviceTemplateRegistrationState !== serviceTemplateRegistrationState.APPROVED ||
                        serviceDetail.isReviewInProgress ||
                        serviceDetail.isAvailableInCatalog
                    }
                >
                    Republish
                </Button>
            </Popconfirm>
        </div>
    );
}

export default RepublishService;
