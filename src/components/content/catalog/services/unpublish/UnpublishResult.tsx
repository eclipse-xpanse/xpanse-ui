/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { category, ServiceTemplateRequestInfo } from '../../../../../xpanse-api/generated';
import { unpublishServiceTemplateErrorText } from '../../../../utils/constants.tsx';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function UnpublishResult({
    category,
    isShowUnpublishAlert,
    setIsShowUnpublishAlert,
    unPublishRequest,
}: {
    category: category;
    isShowUnpublishAlert: boolean;
    setIsShowUnpublishAlert: (isShowUnpublishAlert: boolean) => void;
    unPublishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
}): React.JSX.Element | undefined {
    const queryClient = useQueryClient();

    const onRemove = () => {
        setIsShowUnpublishAlert(false);
    };

    if (unPublishRequest.isSuccess) {
        setIsShowUnpublishAlert(true);
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
    }

    if (isShowUnpublishAlert) {
        return (
            <Alert
                message='Service Unpublished Successfully'
                description={'Service removed from the catalog.'}
                showIcon
                type={'success'}
                closable={true}
                onClose={onRemove}
            />
        );
    }

    const unpublishRequestRetry = () => {
        unPublishRequest.mutate();
    };

    if (unPublishRequest.isError) {
        return (
            <RetryPrompt
                error={unPublishRequest.error}
                retryRequest={unpublishRequestRetry}
                errorMessage={unpublishServiceTemplateErrorText}
                onClose={onRemove}
            />
        );
    }
}
