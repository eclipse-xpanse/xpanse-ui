/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import {
    ServiceTemplateDetailVo,
    ServiceTemplateRegistrationState,
    ServiceTemplateRequestInfo,
} from '../../../../../xpanse-api/generated';

import { UseMutationResult } from '@tanstack/react-query';
import { useGetDeleteMutationState } from '../delete/DeleteServiceMutation';
import { ServiceTemplateAction } from '../details/serviceTemplateAction.tsx';

function RepublishService({
    serviceDetail,
    setIsViewDisabled,
    republishRequest,
    setServiceTemplateAction,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    republishRequest: UseMutationResult<ServiceTemplateRequestInfo | undefined, Error, void>;
    setServiceTemplateAction: (ServiceTemplateAction: ServiceTemplateAction) => void;
}): React.JSX.Element {
    const deleteState = useGetDeleteMutationState(serviceDetail.serviceTemplateId);

    const republish = () => {
        setIsViewDisabled(true);
        republishRequest.mutate();
        setServiceTemplateAction(ServiceTemplateAction.REPUBLISH);
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
                        serviceDetail.serviceTemplateRegistrationState !== ServiceTemplateRegistrationState.APPROVED ||
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
