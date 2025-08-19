/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    DeployRequest,
    ErrorResponse,
    OrderStatus,
    ServiceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { OperationType } from '../types/OperationType';
import { OrderProcessingStatus } from './OrderProcessingStatus.tsx';
import { OrderSubmitResult } from './OrderSubmitResult';

function OrderSubmitStatusAlert({
    serviceId,
    serviceHostType,
    submitDeploymentRequest,
    redeployFailedDeploymentQuery,
    getSubmitLatestServiceOrderStatusQuery,
    serviceProviderContactDetails,
    retryRequest,
    onClose,
}: {
    serviceId: string;
    serviceHostType: ServiceHostingType;
    submitDeploymentRequest:
        | UseMutationResult<ServiceOrder | undefined, Error, DeployRequest>
        | UseMutationResult<ServiceOrder | undefined, Error, string>;
    redeployFailedDeploymentQuery: UseMutationResult<ServiceOrder | undefined, Error, string>;
    getSubmitLatestServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate | undefined>;
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
            if (isHandleKnownErrorResponse(redeployFailedDeploymentQuery.error)) {
                const response: ErrorResponse = redeployFailedDeploymentQuery.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(redeployFailedDeploymentQuery.error.name, [
                    redeployFailedDeploymentQuery.error.message,
                ]);
            }
        } else if (submitDeploymentRequest.isError) {
            if (isHandleKnownErrorResponse(submitDeploymentRequest.error)) {
                const response: ErrorResponse = submitDeploymentRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(submitDeploymentRequest.error.name, [
                    submitDeploymentRequest.error.message,
                ]);
            }
        } else if (submitDeploymentRequest.isSuccess || redeployFailedDeploymentQuery.isSuccess) {
            if (
                getSubmitLatestServiceOrderStatusQuery.isSuccess &&
                (getSubmitLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.SUCCESSFUL ||
                    getSubmitLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.FAILED)
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Deploy}
                        serviceOrderStatus={getSubmitLatestServiceOrderStatusQuery.data}
                        serviceId={serviceId}
                        selectedServiceHostingType={serviceHostType}
                    />
                );
            } else if (getSubmitLatestServiceOrderStatusQuery.isError) {
                if (serviceHostType === ServiceHostingType.SERVICE_VENDOR) {
                    return 'Deployment status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Deployment status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getSubmitLatestServiceOrderStatusQuery.isPending ||
                getSubmitLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'Deploying, Please wait...';
            }
        }
    }, [
        submitDeploymentRequest.isPending,
        submitDeploymentRequest.isError,
        submitDeploymentRequest.isSuccess,
        submitDeploymentRequest.error,
        redeployFailedDeploymentQuery.isPending,
        redeployFailedDeploymentQuery.isError,
        redeployFailedDeploymentQuery.isSuccess,
        redeployFailedDeploymentQuery.error,
        getSubmitLatestServiceOrderStatusQuery.isSuccess,
        getSubmitLatestServiceOrderStatusQuery.data,
        getSubmitLatestServiceOrderStatusQuery.isError,
        getSubmitLatestServiceOrderStatusQuery.isPending,
        serviceId,
        serviceHostType,
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
                getSubmitLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.FAILED
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                getSubmitLatestServiceOrderStatusQuery.isSuccess &&
                getSubmitLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.SUCCESSFUL
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                getSubmitLatestServiceOrderStatusQuery.isPending ||
                getSubmitLatestServiceOrderStatusQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, submitDeploymentRequest, redeployFailedDeploymentQuery, getSubmitLatestServiceOrderStatusQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service deployment request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    const getServiceId = (): string => {
        if (submitDeploymentRequest.isSuccess && submitDeploymentRequest.data) {
            return submitDeploymentRequest.data.serviceId;
        } else {
            if (
                isHandleKnownErrorResponse(submitDeploymentRequest.error) &&
                'serviceId' in submitDeploymentRequest.error.body
            ) {
                return submitDeploymentRequest.error.body.serviceId as string;
            } else {
                return serviceId;
            }
        }
    };

    const getOrderId = (): string => {
        if (submitDeploymentRequest.isSuccess && submitDeploymentRequest.data) {
            return submitDeploymentRequest.data.orderId;
        }
        if (redeployFailedDeploymentQuery.isSuccess && redeployFailedDeploymentQuery.data) {
            return redeployFailedDeploymentQuery.data.orderId;
        }

        if (
            isHandleKnownErrorResponse(redeployFailedDeploymentQuery.error) &&
            'orderId' in redeployFailedDeploymentQuery.error.body
        ) {
            return redeployFailedDeploymentQuery.error.body.orderId as string;
        }

        if (
            isHandleKnownErrorResponse(submitDeploymentRequest.error) &&
            'orderId' in submitDeploymentRequest.error.body
        ) {
            return submitDeploymentRequest.error.body.orderId as string;
        }
        return '-';
    };

    const isDeployDisabled = () => {
        if (
            isHandleKnownErrorResponse(submitDeploymentRequest.error) &&
            !('orderId' in submitDeploymentRequest.error.body && 'serviceId' in submitDeploymentRequest.error.body)
        ) {
            return true;
        }

        if (
            isHandleKnownErrorResponse(redeployFailedDeploymentQuery.error) &&
            !(
                'orderId' in redeployFailedDeploymentQuery.error.body &&
                'serviceId' in redeployFailedDeploymentQuery.error.body
            )
        ) {
            return true;
        }

        return getSubmitLatestServiceOrderStatusQuery.isError;
    };

    return (
        <OrderSubmitResult
            msg={msg ?? ''}
            serviceId={getServiceId()}
            orderId={getOrderId()}
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
