/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import { category } from '../../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';
import { getQueryKey } from '../query/useAvailableServiceTemplatesQuery';

export function CancelServiceTemplateRequestResult({
    category,
    isShowCancelRequestAlert,
    setIsShowCancelRequestAlert,
    cancelServiceTemplateRequest,
}: {
    category: category;
    isShowCancelRequestAlert: boolean;
    setIsShowCancelRequestAlert: (isShowCancelRequestAlert: boolean) => void;
    cancelServiceTemplateRequest: UseMutationResult<void, Error, string>;
}): React.JSX.Element | undefined {
    const queryClient = useQueryClient();

    const onRemove = () => {
        setIsShowCancelRequestAlert(false);
    };

    if (cancelServiceTemplateRequest.isSuccess) {
        setIsShowCancelRequestAlert(true);
        void queryClient.invalidateQueries({ queryKey: getQueryKey(category) });
    }

    if (isShowCancelRequestAlert) {
        return (
            <Alert
                message='Request cancelled'
                description={'Pending service template request cancelled successfully.'}
                showIcon
                type={'success'}
                closable={true}
                onClose={onRemove}
            />
        );
    }

    if (cancelServiceTemplateRequest.isError) {
        return (
            <div>
                {isHandleKnownErrorResponse(cancelServiceTemplateRequest.error) ? (
                    <Alert
                        message='Cancellation failed'
                        description={String(cancelServiceTemplateRequest.error.body.details)}
                        showIcon
                        type={'error'}
                        closable={true}
                        onClose={onRemove}
                    />
                ) : (
                    <Alert
                        message='Cancellation failed'
                        description={cancelServiceTemplateRequest.error.message}
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
