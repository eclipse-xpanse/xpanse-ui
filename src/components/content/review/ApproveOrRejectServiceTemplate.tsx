/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import { Alert, Input, Modal } from 'antd';
import React, { useState } from 'react';
import serviceReviewStyles from '../../../styles/service-review.module.css';
import { ErrorResponse, reviewResult, ServiceTemplateRequestToReview } from '../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';
import { ApproveOrRejectRequestParams } from './query/useApproveOrRejectRequest';

export const ApproveOrRejectServiceTemplate = ({
    currentServiceTemplateRequestToReview,
    isApproved,
    isModalOpen,
    handleModalClose,
    setAlertTipCloseStatus,
    approveOrRejectRequest,
}: {
    currentServiceTemplateRequestToReview: ServiceTemplateRequestToReview;
    isApproved: boolean | undefined;
    isModalOpen: boolean;
    handleModalClose: (arg: boolean) => void;
    setAlertTipCloseStatus: (arg: boolean) => void;
    approveOrRejectRequest: UseMutationResult<void, Error, ApproveOrRejectRequestParams>;
}): React.JSX.Element => {
    const { TextArea } = Input;
    const [comments, setComments] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handleOk = () => {
        if (isApproved !== undefined) {
            if (comments.trim() === '') {
                setError('Comments are required.');
                return;
            }

            const request: ApproveOrRejectRequestParams = {
                id: currentServiceTemplateRequestToReview.requestId,
                reviewServiceTemplateRequest: {
                    reviewResult: isApproved ? reviewResult.APPROVED : reviewResult.REJECTED,
                    reviewComment: comments,
                },
            };
            approveOrRejectRequest.mutate(request);
            handleModalClose(true);
            setComments('');
            setError('');
        }
    };

    const handleCancel = () => {
        setError('');
        setComments('');
        handleModalClose(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setError('');
        setComments(e.target.value);
    };

    const onClose = () => {
        setError('');
        setComments('');
        setAlertTipCloseStatus(true);
    };

    if (approveOrRejectRequest.isError) {
        let errorMessage;
        if (isHandleKnownErrorResponse(approveOrRejectRequest.error)) {
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
                {error && <p className={serviceReviewStyles.reviewCommentsRequired}>{error}</p>}
                <TextArea
                    rows={10}
                    placeholder='Please input your comments.'
                    maxLength={1000}
                    value={comments}
                    onChange={handleChange}
                    rootClassName={error ? serviceReviewStyles.reviewCommentsRequiredText : ''}
                />
            </Modal>
        </>
    );
};
