/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import { Alert, Input, Modal } from 'antd';
import React, { useState } from 'react';
import serviceReviewStyles from '../../../styles/service-review.module.css';
import { ApiError, ErrorResponse, reviewResult, ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import { isErrorResponse } from '../common/error/isErrorResponse';
import { ApproveOrRejectRequestParams } from './query/useApproveOrRejectRequest';

export const ApproveOrRejectServiceTemplate = ({
    currentServiceTemplateVo,
    isApproved,
    isModalOpen,
    handleModalClose,
    setAlertTipCloseStatus,
    approveOrRejectRequest,
}: {
    currentServiceTemplateVo: ServiceTemplateDetailVo;
    isApproved: boolean | undefined;
    isModalOpen: boolean;
    handleModalClose: (arg: boolean) => void;
    setAlertTipCloseStatus: (arg: boolean) => void;
    approveOrRejectRequest: UseMutationResult<void, Error, ApproveOrRejectRequestParams>;
}): React.JSX.Element => {
    const { TextArea } = Input;
    const [comments, setComments] = useState<string>('');
    const handleOk = () => {
        if (isApproved !== undefined) {
            const request: ApproveOrRejectRequestParams = {
                id: currentServiceTemplateVo.serviceTemplateId,
                reviewRegistrationRequest: {
                    reviewResult: isApproved ? reviewResult.APPROVED : reviewResult.REJECTED,
                    reviewComment: comments,
                },
            };
            approveOrRejectRequest.mutate(request);
            handleModalClose(true);
            setComments('');
        }
    };

    const handleCancel = () => {
        handleModalClose(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setComments(e.target.value);
    };

    const onClose = () => {
        setAlertTipCloseStatus(true);
    };

    if (approveOrRejectRequest.isError) {
        let errorMessage;
        if (
            approveOrRejectRequest.error instanceof ApiError &&
            approveOrRejectRequest.error.body &&
            isErrorResponse(approveOrRejectRequest.error.body)
        ) {
            const response: ErrorResponse = approveOrRejectRequest.error.body;
            errorMessage = response.details.join();
        } else {
            errorMessage = approveOrRejectRequest.error.message;
        }
        return (
            <div className={serviceReviewStyles.approveRejectAlertClass}>
                <Alert
                    message={'Service review request failed'}
                    description={errorMessage}
                    showIcon
                    closable={true}
                    onClose={onClose}
                    type={'error'}
                />
            </div>
        );
    }

    if (approveOrRejectRequest.isSuccess) {
        return (
            <div className={serviceReviewStyles.approveRejectAlertClass}>
                <Alert
                    message={'Service template review result submitted'}
                    showIcon
                    closable={true}
                    onClose={onClose}
                    type={'success'}
                />
            </div>
        );
    }

    return (
        <>
            <Modal
                title={isApproved !== undefined && isApproved ? 'Approve' : 'Reject'}
                open={isModalOpen}
                destroyOnClose={true}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <TextArea
                    rows={10}
                    placeholder='Please input your comments.'
                    maxLength={1000}
                    value={comments}
                    onChange={handleChange}
                />
            </Modal>
        </>
    );
};
