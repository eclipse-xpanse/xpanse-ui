/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import {
    category,
    ServiceTemplateDetailVo,
    serviceTemplateRegistrationState,
} from '../../../../../xpanse-api/generated';
import { cancelServiceTemplateReviewErrorText } from '../../../../utils/constants.tsx';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import useServiceTemplateHistoryQuery from '../history/useServiceTemplateHistoryQuery.ts';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function CancelServiceTemplateRequestResult({
    serviceDetail,
    category,
    isShowCancelRequestAlert,
    setIsShowCancelRequestAlert,
    cancelServiceTemplateRequest,
}: {
    serviceDetail: ServiceTemplateDetailVo;
    category: category;
    isShowCancelRequestAlert: boolean;
    setIsShowCancelRequestAlert: (isShowCancelRequestAlert: boolean) => void;
    cancelServiceTemplateRequest: UseMutationResult<void, Error, string>;
}): React.JSX.Element | undefined {
    const queryClient = useQueryClient();

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

    const onRemove = () => {
        setIsShowCancelRequestAlert(false);
    };

    if (cancelServiceTemplateRequest.isSuccess) {
        setIsShowCancelRequestAlert(true);
        void queryClient.invalidateQueries({ queryKey: getQueryKey(category) });
    }

    if (isShowCancelRequestAlert) {
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

    const cancelRequestRetry = () => {
        cancelServiceTemplateRequest.mutate(requestId ?? '');
    };

    if (cancelServiceTemplateRequest.isError) {
        return (
            <RetryPrompt
                error={cancelServiceTemplateRequest.error}
                retryRequest={cancelRequestRetry}
                errorMessage={cancelServiceTemplateReviewErrorText}
                onClose={onRemove}
            />
        );
    }
}
