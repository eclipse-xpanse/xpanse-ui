/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { Category, ServiceTemplateDetailVo, ServiceTemplateRequestStatus } from '../../../../../xpanse-api/generated';
import { cancelServiceTemplateReviewErrorText } from '../../../../utils/constants.tsx';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import { ServiceTemplateAction } from '../details/serviceTemplateAction.tsx';
import useServiceTemplateHistoryQuery from '../history/useServiceTemplateHistoryQuery.ts';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function CancelServiceTemplateRequestResult({
    serviceDetail,
    category,
    cancelServiceTemplateRequest,
    onClose,
    serviceTemplateAction,
    setServiceTemplateAction,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    category: Category;
    cancelServiceTemplateRequest: UseMutationResult<void | undefined, Error, string>;
    onClose: () => void;
    serviceTemplateAction: ServiceTemplateAction;
    setServiceTemplateAction: (componentName: ServiceTemplateAction) => void;
}): React.JSX.Element | undefined {
    const queryClient = useQueryClient();

    const serviceTemplateHistoryQuery = useServiceTemplateHistoryQuery(
        serviceDetail.serviceTemplateId,
        ServiceTemplateRequestStatus.IN_REVIEW,
        undefined
    );

    let requestId: string | undefined = undefined;
    if (
        serviceTemplateHistoryQuery.isSuccess &&
        serviceTemplateHistoryQuery.data &&
        serviceTemplateHistoryQuery.data.length > 0
    ) {
        requestId = serviceTemplateHistoryQuery.data.reduce((latest, current) => {
            return new Date(current.createdTime) > new Date(latest.createdTime) ? current : latest;
        }).requestId;
    }

    const onRemove = () => {
        onClose();
    };

    if (cancelServiceTemplateRequest.isSuccess) {
        void queryClient.invalidateQueries({ queryKey: getQueryKey(category) });
    }

    const cancelRequestRetry = () => {
        cancelServiceTemplateRequest.mutate(requestId ?? '');
        setServiceTemplateAction(ServiceTemplateAction.CANCEL);
    };

    if (serviceTemplateAction === ServiceTemplateAction.CANCEL && cancelServiceTemplateRequest.isError) {
        return (
            <RetryPrompt
                error={cancelServiceTemplateRequest.error}
                retryRequest={cancelRequestRetry}
                errorMessage={cancelServiceTemplateReviewErrorText}
                onClose={onRemove}
            />
        );
    }

    if (serviceTemplateAction === ServiceTemplateAction.CANCEL) {
        return (
            <Alert
                message='Request cancelled'
                description={'Pending service template request cancelled successfully.'}
                showIcon
                type={'success'}
                closable={true}
                onClose={onRemove}
            />
        );
    }
}
