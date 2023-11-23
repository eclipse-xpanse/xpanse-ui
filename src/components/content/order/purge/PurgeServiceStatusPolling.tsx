/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { useEffect, useState } from 'react';
import { ApiError, Response, ServiceService, DeployedService } from '../../../../xpanse-api/generated';
import { useQuery } from '@tanstack/react-query';
import { deploymentStatusPollingInterval } from '../../../utils/constants';
import { Alert } from 'antd';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export function PurgeServiceStatusPolling({
    uuid,
    isError,
    error,
    setIsPurgingCompleted,
    getPurgeCloseStatus,
    serviceHostingType,
}: {
    uuid: string;
    isError: boolean;
    error: Error | null;
    setIsPurgingCompleted: (arg: boolean) => void;
    getPurgeCloseStatus: (arg: boolean) => void;
    serviceHostingType: DeployedService.serviceHostingType;
}): React.JSX.Element {
    const [isRefetch, setIsRefetch] = useState<boolean>(true);
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
                return ServiceService.getSelfHostedServiceDetailsById(uuid);
            } else {
                return ServiceService.getVendorHostedServiceDetailsById(uuid);
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: uuid.length > 0 && isRefetch ? deploymentStatusPollingInterval : false,
        enabled: uuid.length > 0 && isRefetch,
    });

    useEffect(() => {
        if (isError) {
            setIsRefetch(false);
            setIsPurgingCompleted(true);
        }
    }, [isError, setIsPurgingCompleted]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isError) {
            setIsRefetch(false);
            setIsPurgingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.isError, setIsPurgingCompleted]);

    const onClose = () => {
        getPurgeCloseStatus(true);
    };

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
                            onClose={onClose}
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
                            onClose={onClose}
                            type={'error'}
                        />{' '}
                    </div>
                );
            } else {
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={'Processing Status'}
                            description={
                                <OrderSubmitResultDetails msg={`Service ${uuid} purged successfully`} uuid={uuid} />
                            }
                            showIcon
                            closable={true}
                            onClose={onClose}
                            type={'success'}
                        />{' '}
                    </div>
                );
            }
        }
    }

    return <></>;
}
