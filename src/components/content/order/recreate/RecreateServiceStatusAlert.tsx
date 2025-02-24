/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useStopwatch } from 'react-timer-hook';
import {
    DeployedService,
    ErrorResponse,
    orderStatus,
    serviceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { OrderProcessingStatus } from '../orderStatus/OrderProcessingStatus.tsx';
import { OperationType } from '../types/OperationType.ts';
import { RecreateOrderSubmitResult } from './RecreateOrderSubmitResult.tsx';

function RecreateServiceStatusAlert({
    currentSelectedService,
    recreateRequest,
    recreateServiceOrderStatusPollingQuery,
    closeRecreateResultAlert,
    serviceProviderContactDetails,
}: {
    currentSelectedService: DeployedService;
    recreateRequest: UseMutationResult<ServiceOrder, Error, string>;
    recreateServiceOrderStatusPollingQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    closeRecreateResultAlert: (arg: boolean) => void;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const msg = useMemo(() => {
        if (recreateRequest.isPending) {
            return 'Recreate request submission in-progress';
        } else if (recreateRequest.isError) {
            if (isHandleKnownErrorResponse(recreateRequest.error)) {
                const response: ErrorResponse = recreateRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(recreateRequest.error.name, [recreateRequest.error.message]);
            }
        } else if (recreateRequest.isSuccess) {
            if (
                recreateServiceOrderStatusPollingQuery.isSuccess &&
                (recreateServiceOrderStatusPollingQuery.data.orderStatus.toString() ===
                    orderStatus.SUCCESSFUL.toString() ||
                    recreateServiceOrderStatusPollingQuery.data.orderStatus.toString() ===
                        orderStatus.FAILED.toString())
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Recreate}
                        serviceOrderStatus={recreateServiceOrderStatusPollingQuery.data}
                        serviceId={currentSelectedService.serviceId}
                        selectedServiceHostingType={currentSelectedService.serviceHostingType as serviceHostingType}
                    />
                );
            } else if (recreateServiceOrderStatusPollingQuery.isError) {
                if (currentSelectedService.serviceHostingType === serviceHostingType.SERVICE_VENDOR) {
                    return 'Recreate status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Recreate status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                recreateServiceOrderStatusPollingQuery.isPending ||
                recreateServiceOrderStatusPollingQuery.data.orderStatus.toString() ===
                    orderStatus.IN_PROGRESS.toString()
            ) {
                return 'Recreating, Please wait...';
            }
        }
    }, [currentSelectedService, recreateRequest, recreateServiceOrderStatusPollingQuery]);

    const alertType = useMemo(() => {
        if (recreateRequest.isPending) {
            return 'success';
        } else if (recreateRequest.isError || recreateServiceOrderStatusPollingQuery.isError) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
            return 'error';
        } else if (recreateRequest.isSuccess) {
            if (
                recreateServiceOrderStatusPollingQuery.isSuccess &&
                recreateServiceOrderStatusPollingQuery.data.orderStatus.toString() === orderStatus.FAILED.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                recreateServiceOrderStatusPollingQuery.isSuccess &&
                recreateServiceOrderStatusPollingQuery.data.orderStatus.toString() === orderStatus.SUCCESSFUL.toString()
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                recreateServiceOrderStatusPollingQuery.isPending ||
                recreateServiceOrderStatusPollingQuery.data.orderStatus.toString() ===
                    orderStatus.IN_PROGRESS.toString()
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, recreateRequest, recreateServiceOrderStatusPollingQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service recreate request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    return (
        <RecreateOrderSubmitResult
            msg={msg ?? ''}
            uuid={recreateRequest.data?.serviceId ?? '-'}
            type={alertType}
            stopWatch={stopWatch}
            closeRecreateResultAlert={closeRecreateResultAlert}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default RecreateServiceStatusAlert;
