/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { Category, ServiceTemplateRequestInfo } from '../../../../../xpanse-api/generated';
import { unpublishServiceTemplateErrorText } from '../../../../utils/constants.tsx';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import { ServiceTemplateAction } from '../details/serviceTemplateAction.tsx';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function UnpublishResult({
    category,
    unPublishRequest,
    onClose,
    serviceTemplateAction,
    setServiceTemplateAction,
}: {
    category: Category;
    unPublishRequest: UseMutationResult<ServiceTemplateRequestInfo | undefined, Error, void>;
    onClose: () => void;
    serviceTemplateAction: ServiceTemplateAction;
    setServiceTemplateAction: (ServiceTemplateAction: ServiceTemplateAction) => void;
}): React.JSX.Element | undefined {
    const queryClient = useQueryClient();

    const onRemove = () => {
        onClose();
    };

    if (unPublishRequest.isSuccess) {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
    }

    const unpublishRequestRetry = () => {
        unPublishRequest.mutate();
        setServiceTemplateAction(ServiceTemplateAction.UNPUBLISH);
    };

    if (serviceTemplateAction === ServiceTemplateAction.UNPUBLISH && unPublishRequest.isError) {
        return (
            <RetryPrompt
                error={unPublishRequest.error}
                retryRequest={unpublishRequestRetry}
                errorMessage={unpublishServiceTemplateErrorText}
                onClose={onRemove}
            />
        );
    }

    if (serviceTemplateAction === ServiceTemplateAction.UNPUBLISH) {
        return (
            <Alert
                message='Service unpublished successfully'
                description={'Service removed from the catalog.'}
                showIcon
                type={'success'}
                closable={true}
                onClose={onRemove}
            />
        );
    }
}
