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
import { useGetUnregisterMutationState } from './UnregisterMutation';

export function UnregisterResult({ id, category }: { id: string; category: category }): React.JSX.Element | undefined {
    const useUnregisterRequestState = useGetUnregisterMutationState(id);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
        });
    };

    if (useUnregisterRequestState[0]) {
        if (useUnregisterRequestState[0].status === 'success') {
            return (
                <Alert
                    message='Service Unregistered Successfully'
                    description={'Service removed from the catalog.'}
                    showIcon
                    type={'success'}
                    closable={true}
                    onClose={onRemove}
                />
            );
        }

        if (useUnregisterRequestState[0].status === 'error') {
            if (useUnregisterRequestState[0].error) {
                return (
                    <div>
                        {useUnregisterRequestState[0].error instanceof ApiError &&
                        useUnregisterRequestState[0].error.body &&
                        typeof useUnregisterRequestState[0].error.body === 'object' &&
                        'details' in useUnregisterRequestState[0].error.body ? (
                            <Alert
                                message='Unregister Request Failed'
                                description={String(useUnregisterRequestState[0].error.body.details)}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        ) : (
                            <Alert
                                message='Unregister Request Failed'
                                description={useUnregisterRequestState[0].error.message}
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
