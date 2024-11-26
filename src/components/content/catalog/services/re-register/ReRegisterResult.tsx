/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, category, serviceTemplateRegistrationState } from '../../../../../xpanse-api/generated';
import { catalogPageRoute } from '../../../../utils/constants';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';
import { useGetReRegisterMutationState } from './ReRegisterMutation';

export function ReRegisterResult({
    id,
    serviceRegistrationStatus,
    category,
}: {
    id: string;
    serviceRegistrationStatus: serviceTemplateRegistrationState;
    category: category;
}): React.JSX.Element | undefined {
    const useReRegisterRequestState = useGetReRegisterMutationState(id);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onRemove = () => {
        void queryClient.refetchQueries({ queryKey: getQueryKey(category) });
        void navigate({
            pathname: catalogPageRoute,
            hash: '#' + category,
        });
    };

    if (useReRegisterRequestState[0]) {
        if (useReRegisterRequestState[0].status === 'success') {
            return (
                <Alert
                    message={
                        serviceRegistrationStatus === serviceTemplateRegistrationState.APPROVED
                            ? 'service added to catalog again successfully'
                            : 'Service re-registered successfully'
                    }
                    description={'Service submitted for review of cloud provider.'}
                    showIcon
                    type={'success'}
                    closable={true}
                    onClose={onRemove}
                />
            );
        }

        if (useReRegisterRequestState[0].status === 'error') {
            if (useReRegisterRequestState[0].error) {
                return (
                    <div>
                        {useReRegisterRequestState[0].error instanceof ApiError &&
                        useReRegisterRequestState[0].error.body &&
                        typeof useReRegisterRequestState[0].error.body === 'object' &&
                        'details' in useReRegisterRequestState[0].error.body ? (
                            <Alert
                                message='Re-Register Request Failed'
                                description={String(useReRegisterRequestState[0].error.body.details)}
                                showIcon
                                type={'error'}
                                closable={true}
                                onClose={onRemove}
                            />
                        ) : (
                            <Alert
                                message='Re-Register Request Failed'
                                description={useReRegisterRequestState[0].error.message}
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
