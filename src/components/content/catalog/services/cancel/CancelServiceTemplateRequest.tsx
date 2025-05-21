/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo, serviceTemplateRegistrationState } from '../../../../../xpanse-api/generated';
import { ServiceTemplateAction } from '../details/serviceTemplateAction.tsx';
import useServiceTemplateHistoryQuery from '../history/useServiceTemplateHistoryQuery';
function CancelServiceTemplateRequest({
    serviceDetail,
    setIsViewDisabled,
    cancelServiceTemplateRequest,
    setServiceTemplateAction,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    cancelServiceTemplateRequest: UseMutationResult<void, Error, string>;
    setServiceTemplateAction: (ServiceTemplateAction: ServiceTemplateAction) => void;
}): React.JSX.Element {
    const serviceTemplateHistoryQuery = useServiceTemplateHistoryQuery(
        serviceDetail.serviceTemplateId,
        serviceTemplateRegistrationState.IN_REVIEW,
        undefined
    );

    let requestId: string | undefined = undefined;
    if (serviceTemplateHistoryQuery.isSuccess && serviceTemplateHistoryQuery.data.length > 0) {
        requestId = serviceTemplateHistoryQuery.data.reduce((latest, current) => {
            return new Date(current.createdTime) > new Date(latest.createdTime) ? current : latest;
        }).requestId;
    }

    const cancel = () => {
        setIsViewDisabled(true);
        cancelServiceTemplateRequest.mutate(requestId ?? '');
        setServiceTemplateAction(ServiceTemplateAction.CANCEL);
    };

    const isDisableCancel = (serviceDetail: ServiceTemplateDetailVo) => {
        return !(serviceDetail.serviceTemplateRegistrationState === 'in-review' || serviceDetail.isReviewInProgress);
    };

    return (
        <div className={catalogStyles.updateUnpublishBtnClass}>
            <Popconfirm
                title='cancel the pending service template request?'
                description='Are you sure to cancel this pending service template request?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    cancel();
                }}
            >
                <Button
                    type='primary'
                    icon={<CloseCircleOutlined />}
                    disabled={isDisableCancel(serviceDetail)}
                    className={catalogStyles.catalogManageBtnClass}
                >
                    Cancel
                </Button>
            </Popconfirm>
        </div>
    );
}

export default CancelServiceTemplateRequest;
