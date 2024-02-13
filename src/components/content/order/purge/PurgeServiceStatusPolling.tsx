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
    deployedService,
    isError,
    error,
    setIsPurging,
    closePurgeResultAlert,
    serviceHostingType,
}: {
    deployedService: DeployedService;
    isError: boolean;
    error: Error | null;
    setIsPurging: (arg: boolean) => void;
    closePurgeResultAlert: (arg: boolean) => void;
    serviceHostingType: DeployedService.serviceHostingType;
}): React.JSX.Element {
    const [isRefetch, setIsRefetch] = useState<boolean>(true);
    const getServiceDetailsByIdQuery = useQuery({
        queryKey: ['getPurgeServiceDetailsById', deployedService.id, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
                return ServiceService.getSelfHostedServiceDetailsById(deployedService.id);
            } else {
                return ServiceService.getVendorHostedServiceDetailsById(deployedService.id);
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: deployedService.id.length > 0 && isRefetch ? deploymentStatusPollingInterval : false,
        enabled: deployedService.id.length > 0 && isRefetch,
    });

    useEffect(() => {
        if (isError) {
            setIsRefetch(false);
            setIsPurging(false);
        }
    }, [isError, setIsPurging]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isError) {
            setIsRefetch(false);
            setIsPurging(false);
        }
    }, [getServiceDetailsByIdQuery.isError, setIsPurging]);

    const onClose = () => {
        setIsPurging(false);
        closePurgeResultAlert(true);
    };

    if (isError) {
        if (error instanceof ApiError && error.body && 'details' in error.body) {
            const response: Response = error.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={
                                <OrderSubmitResultDetails msg={'Purge request failed'} uuid={deployedService.id} />
                            }
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

    if (deployedService.id && getServiceDetailsByIdQuery.isError) {
        if (
            getServiceDetailsByIdQuery.error instanceof ApiError &&
            getServiceDetailsByIdQuery.error.body &&
            'details' in getServiceDetailsByIdQuery.error.body
        ) {
            const response: Response = getServiceDetailsByIdQuery.error.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={
                                <OrderSubmitResultDetails msg={'Purge request failed'} uuid={deployedService.id} />
                            }
                            showIcon
                            closable={true}
                            onClose={onClose}
                            type={'error'}
                        />{' '}
                    </div>
                );
            } else {
                deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL;
                return (
                    <div className={'submit-alert-tip'}>
                        {' '}
                        <Alert
                            message={'Processing Status'}
                            description={
                                <OrderSubmitResultDetails
                                    msg={`Service ${deployedService.id} purged successfully`}
                                    uuid={deployedService.id}
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
