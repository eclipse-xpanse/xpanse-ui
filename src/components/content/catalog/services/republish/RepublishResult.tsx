/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, category } from '../../../../../xpanse-api/generated';
import { catalogPageRoute } from '../../../../utils/constants';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { useGetRepublishMutationState } from './RepublishMutation.ts';

export function RepublishResult({ id, category }: { id: string; category: category }): React.JSX.Element | undefined {
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
        if (useRepublishRequestState[0].status === 'success') {
            return (
                <Alert
                    message={'service added to catalog again successfully'}
                    description={'Service submitted for review of cloud provider.'}
                    showIcon
                    type={'success'}
                    closable={true}
                    onClose={onRemove}
                />
            );
        }

        if (useRepublishRequestState[0].status === 'error') {
            if (useRepublishRequestState[0].error) {
                return (
                    <div>
                        {useRepublishRequestState[0].error instanceof ApiError &&
                        useRepublishRequestState[0].error.body &&
                        typeof useRepublishRequestState[0].error.body === 'object' &&
                        'details' in useRepublishRequestState[0].error.body ? (
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
