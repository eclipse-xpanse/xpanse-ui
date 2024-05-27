/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Input, Modal } from 'antd';
import React, { useState } from 'react';
import serviceReviewStyles from '../../../styles/service-review.module.css';
import { ApiError, Response, ReviewRegistrationRequest, ServiceTemplateDetailVo } from '../../../xpanse-api/generated';
import useApproveOrRejectRequest, { ApproveOrRejectRequestParams } from './query/useApproveOrRejectRequest';

export const ApproveOrRejectServiceTemplate = ({
    currentServiceTemplateVo,
    isApproved,
    isModalOpen,
    handleModalClose,
    setAlertTipCloseStatus,
}: {
    currentServiceTemplateVo: ServiceTemplateDetailVo;
    isApproved: boolean | undefined;
    isModalOpen: boolean;
    handleModalClose: (arg: boolean) => void;
    setAlertTipCloseStatus: (arg: boolean) => void;
}): React.JSX.Element => {
    const { TextArea } = Input;
    const [comments, setComments] = useState<string>('');
    const approveOrRejectRequest = useApproveOrRejectRequest(currentServiceTemplateVo.id);
    const handleOk = () => {
        if (isApproved !== undefined) {
            const request: ApproveOrRejectRequestParams = {
                id: currentServiceTemplateVo.id,
                reviewRegistrationRequest: {
                    reviewResult: isApproved
                        ? ReviewRegistrationRequest.reviewResult.APPROVED
                        : ReviewRegistrationRequest.reviewResult.REJECTED,
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
            'details' in approveOrRejectRequest.error.body
        ) {
            const response: Response = approveOrRejectRequest.error.body as Response;
            errorMessage = response.details.join();
        } else {
            errorMessage = approveOrRejectRequest.error.message;
        }
        return (
            <div className={serviceReviewStyles.approveRejectAlertClass}>
                <Alert
                    message={errorMessage}
                    description={'Register service review failed.'}
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
                    message={'Processing Status'}
                    description={'Service template reviewed successfully.'}
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
