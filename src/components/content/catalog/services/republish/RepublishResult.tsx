/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { category, ServiceTemplateRequestInfo } from '../../../../../xpanse-api/generated';
import { catalogPageRoute } from '../../../../utils/constants';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { useGetRepublishMutationState } from './RepublishMutation.ts';

export function RepublishResult({
    id,
    category,
    republishRequest,
}: {
    id: string;
    category: category;
    republishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
}): React.JSX.Element | undefined {
    const useRepublishRequestState = useGetRepublishMutationState(id);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
        });
    };

    if (useRepublishRequestState[0]) {
        if (republishRequest.isSuccess && useRepublishRequestState[0].status === 'success') {
            return (
                <Alert
                    message={
                        republishRequest.data.requestSubmittedForReview
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

        if (republishRequest.isError || useRepublishRequestState[0].status === 'error') {
            if (useRepublishRequestState[0].error) {
                return (
                    <div>
                        {isHandleKnownErrorResponse(useRepublishRequestState[0].error) ? (
                            <Alert
                                message='Republish Request Failed'
                                description={String(useRepublishRequestState[0].error.body.details)}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        ) : (
                            <Alert
                                message='Republish Request Failed'
                                description={useRepublishRequestState[0].error.message}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        )}
                    </div>
                );
            }
        }
    }
}
