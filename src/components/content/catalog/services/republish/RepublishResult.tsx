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
import { ServiceTemplateAction } from '../details/serviceTemplateAction.tsx';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function RepublishResult({
    category,
    republishRequest,
    onClose,
    serviceTemplateAction,
    setServiceTemplateAction,
}: {
    category: category;
    republishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
    onClose: () => void;
    serviceTemplateAction: ServiceTemplateAction;
    setServiceTemplateAction: (componentName: ServiceTemplateAction) => void;
}): React.JSX.Element | undefined {
    //const useRepublishRequestState = useGetRepublishMutationState(id);
    const queryClient = useQueryClient();
    const onRemove = () => {
        onClose();
    };

    if (republishRequest.isSuccess) {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
    }

    const republishRequestRetry = () => {
        republishRequest.mutate();
        setServiceTemplateAction(ServiceTemplateAction.REPUBLISH);
    };

    if (serviceTemplateAction === ServiceTemplateAction.REPUBLISH && republishRequest.isError) {
        return (
            <RetryPrompt
                error={republishRequest.error}
                retryRequest={republishRequestRetry}
                errorMessage={republishServiceTemplateErrorText}
                onClose={onRemove}
            />
        );
    }

    if (serviceTemplateAction === ServiceTemplateAction.REPUBLISH) {
        return (
            <Alert
                message='Service republish request submitted successfully'
                description={
                    republishRequest.data?.requestSubmittedForReview
                        ? 'service template update request submitted to review'
                        : 'Service template added to the catalog again.'
                }
                showIcon
                type={'success'}
                closable={true}
                onClose={onRemove}
            />
        );
    }
}
