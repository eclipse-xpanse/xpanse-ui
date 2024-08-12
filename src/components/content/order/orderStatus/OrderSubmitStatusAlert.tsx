/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    ApiError,
    DeployedServiceDetails,
    DeployRequest,
    Response,
    serviceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { OperationType } from '../types/OperationType';
import { OrderSubmitResult } from './OrderSubmitResult';
import { ProcessingStatus } from './ProcessingStatus';

function OrderSubmitStatusAlert({
    uuid,
    serviceHostType,
    submitDeploymentRequest,
    redeployFailedDeploymentQuery,
    getSubmitLatestServiceOrderStatusQuery,
    deployedServiceDetails,
    serviceProviderContactDetails,
    retryRequest,
    onClose,
}: {
    uuid: string;
    serviceHostType: serviceHostingType;
    submitDeploymentRequest:
        | UseMutationResult<ServiceOrder, Error, DeployRequest>
        | UseMutationResult<ServiceOrder, Error, string>;
    redeployFailedDeploymentQuery: UseMutationResult<ServiceOrder, Error, string>;
    getSubmitLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    deployedServiceDetails: DeployedServiceDetails | undefined;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
    retryRequest: () => void;
    onClose: () => void;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });
    const msg = useMemo(() => {
        if (submitDeploymentRequest.isPending || redeployFailedDeploymentQuery.isPending) {
            return 'Request submission in-progress';
        } else if (redeployFailedDeploymentQuery.isError) {
            if (
                redeployFailedDeploymentQuery.error instanceof ApiError &&
                redeployFailedDeploymentQuery.error.body &&
                typeof redeployFailedDeploymentQuery.error.body === 'object' &&
                'details' in redeployFailedDeploymentQuery.error.body
            ) {
                const response: Response = redeployFailedDeploymentQuery.error.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([redeployFailedDeploymentQuery.error.message]);
            }
        } else if (submitDeploymentRequest.isError) {
            if (
                submitDeploymentRequest.error instanceof ApiError &&
                submitDeploymentRequest.error.body &&
                typeof submitDeploymentRequest.error.body === 'object' &&
                'details' in submitDeploymentRequest.error.body
            ) {
                const response: Response = submitDeploymentRequest.error.body as Response;
                return getOrderSubmissionFailedDisplay(response.details);
            } else {
                return getOrderSubmissionFailedDisplay([submitDeploymentRequest.error.message]);
            }
        } else if (submitDeploymentRequest.isSuccess || redeployFailedDeploymentQuery.isSuccess) {
            if (
                getSubmitLatestServiceOrderStatusQuery.isSuccess &&
                (getSubmitLatestServiceOrderStatusQuery.data.taskStatus.toString() ===
                    taskStatus.SUCCESSFUL.toString() ||
                    getSubmitLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.FAILED.toString())
            ) {
                return <ProcessingStatus response={deployedServiceDetails} operationType={OperationType.Deploy} />;
            } else if (getSubmitLatestServiceOrderStatusQuery.isError) {
                if (serviceHostType === serviceHostingType.SERVICE_VENDOR) {
                    return 'Deployment status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Deployment status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getSubmitLatestServiceOrderStatusQuery.isPending ||
                getSubmitLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                return 'Deploying, Please wait...';
            }
        }
    }, [
        serviceHostType,
        deployedServiceDetails,
        submitDeploymentRequest,
        redeployFailedDeploymentQuery,
        getSubmitLatestServiceOrderStatusQuery,
    ]);

    const alertType = useMemo(() => {
        if (submitDeploymentRequest.isPending || redeployFailedDeploymentQuery.isPending) {
            return 'success';
        } else if (
            redeployFailedDeploymentQuery.isError ||
            submitDeploymentRequest.isError ||
            getSubmitLatestServiceOrderStatusQuery.isError
        ) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
            return 'error';
        } else if (submitDeploymentRequest.isSuccess || redeployFailedDeploymentQuery.isSuccess) {
            if (
                getSubmitLatestServiceOrderStatusQuery.isSuccess &&
                getSubmitLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.FAILED.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                getSubmitLatestServiceOrderStatusQuery.isSuccess &&
                getSubmitLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                getSubmitLatestServiceOrderStatusQuery.isPending ||
                getSubmitLatestServiceOrderStatusQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, submitDeploymentRequest, redeployFailedDeploymentQuery, getSubmitLatestServiceOrderStatusQuery]);

    function getOrderSubmissionFailedDisplay(reasons: string[]) {
        return (
            <div>
                <span>{'Service deployment request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    const getServiceId = (): string => {
        if (submitDeploymentRequest.isSuccess) {
            return submitDeploymentRequest.data.serviceId;
        } else {
            if (
                submitDeploymentRequest.error instanceof ApiError &&
                submitDeploymentRequest.error.body &&
                typeof submitDeploymentRequest.error.body === 'object' &&
                'serviceId' in submitDeploymentRequest.error.body
            ) {
                return submitDeploymentRequest.error.body.serviceId as string;
            } else {
                return uuid;
            }
        }
    };

    const isDeployDisabled = () => {
        if (
            submitDeploymentRequest.isError &&
            submitDeploymentRequest.error instanceof ApiError &&
            submitDeploymentRequest.error.body &&
            typeof submitDeploymentRequest.error.body === 'object' &&
            !('orderId' in submitDeploymentRequest.error.body && 'serviceId' in submitDeploymentRequest.error.body)
        ) {
            return true;
        }

        if (
            redeployFailedDeploymentQuery.isError &&
            redeployFailedDeploymentQuery.error instanceof ApiError &&
            redeployFailedDeploymentQuery.error.body &&
            typeof redeployFailedDeploymentQuery.error.body === 'object' &&
            !(
                'orderId' in redeployFailedDeploymentQuery.error.body &&
                'serviceId' in redeployFailedDeploymentQuery.error.body
            )
        ) {
            return true;
        }
        return false;
    };

    return (
        <OrderSubmitResult
            msg={msg ?? ''}
            uuid={getServiceId()}
            type={alertType}
            stopWatch={stopWatch}
            isDeployRequestError={isDeployDisabled()}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
            retryRequest={retryRequest}
            onClose={onClose}
        />
    );
}

export default OrderSubmitStatusAlert;
