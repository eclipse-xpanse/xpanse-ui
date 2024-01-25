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
    uuid: DeployedService;
    isError: boolean;
    error: Error | null;
    setIsPurgingCompleted: (arg: boolean) => void;
    getPurgeCloseStatus: (arg: boolean) => void;
    serviceHostingType: DeployedService.serviceHostingType;
}): React.JSX.Element {
    const [isRefetch, setIsRefetch] = useState<boolean>(true);
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid.id, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
                return ServiceService.getSelfHostedServiceDetailsById(uuid.id);
            } else {
                return ServiceService.getVendorHostedServiceDetailsById(uuid.id);
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: uuid.id.length > 0 && isRefetch ? deploymentStatusPollingInterval : false,
        enabled: uuid.id.length > 0 && isRefetch,
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
        if (error instanceof ApiError && error.body && 'details' in error.body) {
            const response: Response = error.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                uuid.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={uuid.id} />}
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

    if (uuid.id && getServiceDetailsByIdQuery.isError) {
        if (
            getServiceDetailsByIdQuery.error instanceof ApiError &&
            getServiceDetailsByIdQuery.error.body &&
            'details' in getServiceDetailsByIdQuery.error.body
        ) {
            const response: Response = getServiceDetailsByIdQuery.error.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                uuid.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={uuid.id} />}
                            showIcon
                            closable={true}
                            onClose={onClose}
                            type={'error'}
                        />{' '}
                    </div>
                );
            } else {
                uuid.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL;
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={'Processing Status'}
                            description={
                                <OrderSubmitResultDetails
                                    msg={`Service ${uuid.id} purged successfully`}
                                    uuid={uuid.id}
                                />
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
