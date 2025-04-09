/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { category, ServiceTemplateRequestInfo } from '../../../../../xpanse-api/generated';
import { republishServiceTemplateErrorText } from '../../../../utils/constants.tsx';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function RepublishResult({
    category,
    isShowRepublishAlert,
    setIsShowRepublishAlert,
    republishRequest,
}: {
    category: category;
    isShowRepublishAlert: boolean;
    setIsShowRepublishAlert: (isShowRepublishAlert: boolean) => void;
    republishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
}): React.JSX.Element | undefined {
    //const useRepublishRequestState = useGetRepublishMutationState(id);
    const queryClient = useQueryClient();
    const onRemove = () => {
        setIsShowRepublishAlert(false);
    };

    if (republishRequest.isSuccess) {
        setIsShowRepublishAlert(true);
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
    }

    if (isShowRepublishAlert) {
        return (
            <Alert
                message={
                    republishRequest.data?.requestSubmittedForReview
                        ? 'service template update request submitted to review'
                        : 'Service template updated in catalog successfully'
                }
                description={'Service submitted for review of cloud provider.'}
                showIcon
                type={'success'}
                closable={true}
                onClose={onRemove}
            />
        );
    }

    const republishRequestRetry = () => {
        republishRequest.mutate();
    };

    if (republishRequest.error) {
        return (
            <RetryPrompt
                error={republishRequest.error}
                retryRequest={republishRequestRetry}
                errorMessage={republishServiceTemplateErrorText}
                onClose={onRemove}
            />
        );
    }
}
