/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect } from 'react';
import { ApiError, Response, ServiceService } from '../../../../xpanse-api/generated';
import { useQuery } from '@tanstack/react-query';
import { deploymentStatusPollingInterval } from '../../../utils/constants';
import { Alert } from 'antd';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export function PurgeServiceStatusPolling({
    uuid,
    isError,
    error,
    isSuccess,
    setIsPurging,
    setIsPurgingCompleted,
}: {
    uuid: string;
    isError: boolean;
    error: Error | undefined;
    isSuccess: boolean;
    setIsPurging: (arg: boolean) => void;
    setIsPurgingCompleted: (arg: boolean) => void;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getServiceDetailsById', uuid],
        queryFn: () => ServiceService.getServiceDetailsById(uuid),
        refetchOnWindowFocus: false,
        refetchInterval: uuid.length > 0 && isSuccess ? deploymentStatusPollingInterval : false,
        enabled: uuid.length > 0 && isSuccess,
    });

    useEffect(() => {
        if (isError) {
            setIsPurging(false);
            setIsPurgingCompleted(true);
        }
    }, [isError, setIsPurgingCompleted, setIsPurging]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isError) {
            setIsPurging(false);
            setIsPurgingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.isError, getServiceDetailsByIdQuery.error, setIsPurging, setIsPurgingCompleted]);

    if (isError) {
        if (error instanceof ApiError && 'details' in error.body) {
            const response: Response = error.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={uuid} />}
                            showIcon
                            closable={true}
                            type={'error'}
                        />{' '}
                    </div>
                );
            }
        }
    }

    if (uuid && getServiceDetailsByIdQuery.isError) {
        if (
            getServiceDetailsByIdQuery.error instanceof ApiError &&
            'details' in getServiceDetailsByIdQuery.error.body
        ) {
            const response: Response = getServiceDetailsByIdQuery.error.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={uuid} />}
                            showIcon
                            closable={true}
                            type={'error'}
                        />{' '}
                    </div>
                );
            }
        }
    }

    return <></>;
}
