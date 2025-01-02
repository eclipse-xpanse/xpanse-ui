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
import { useGetUnpublishMutationState } from './UnpublishMutation.ts';

export function UnpublishResult({
    id,
    category,
    unPublishRequest,
}: {
    id: string;
    category: category;
    unPublishRequest: UseMutationResult<ServiceTemplateRequestInfo, Error, void>;
}): React.JSX.Element | undefined {
    const useUnpublishRequestState = useGetUnpublishMutationState(id);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
        });
    };

    if (useUnpublishRequestState[0]) {
        if (useUnpublishRequestState[0].status === 'success' && unPublishRequest.isSuccess) {
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

        if (useUnpublishRequestState[0].status === 'error' || unPublishRequest.isError) {
            if (useUnpublishRequestState[0].error) {
                return (
                    <div>
                        {isHandleKnownErrorResponse(useUnpublishRequestState[0].error) ? (
                            <Alert
                                message='Unpublish Request Failed'
                                description={String(useUnpublishRequestState[0].error.body.details)}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        ) : (
                            <Alert
                                message='Unpublish Request Failed'
                                description={useUnpublishRequestState[0].error.message}
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
