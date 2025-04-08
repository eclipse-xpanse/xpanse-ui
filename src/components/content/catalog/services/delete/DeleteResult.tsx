/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { category } from '../../../../../xpanse-api/generated';
import { catalogPageRoute, deleteServiceTemplateErrorText } from '../../../../utils/constants.tsx';
import RetryPrompt from '../../../common/error/RetryPrompt.tsx';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { useGetDeleteMutationState } from './DeleteServiceMutation';

export function DeleteResult({
    id,
    category,
    deleteServiceRequest,
}: {
    id: string;
    category: category;
    deleteServiceRequest: UseMutationResult<void, Error, void>;
}): React.JSX.Element | undefined {
    const deleteRequestState = useGetDeleteMutationState(id);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        deleteServiceRequest.reset();
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
        });
    };

    const deleteRequest = () => {
        deleteServiceRequest.mutate();
    };

    if (deleteRequestState[0]) {
        if (deleteRequestState[0].status === 'success') {
            return (
                <Alert
                    message='Service Deleted Successfully'
                    description={'Service removed from the database completely.'}
                    showIcon
                    type={'success'}
                    closable={true}
                    onClose={onRemove}
                />
            );
        }

        if (deleteRequestState[0].status === 'error') {
            if (deleteRequestState[0].error) {
                return (
                    <RetryPrompt
                        error={deleteRequestState[0].error}
                        retryRequest={deleteRequest}
                        errorMessage={deleteServiceTemplateErrorText}
                        onClose={onRemove}
                    />
                );
            }
        }
    }
}
