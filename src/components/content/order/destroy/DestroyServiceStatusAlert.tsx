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
    OrderStatus,
    ServiceHostingType,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList.tsx';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { OrderProcessingStatus } from '../orderStatus/OrderProcessingStatus.tsx';
import { OperationType } from '../types/OperationType.ts';
import { DestroyOrderSubmitResult } from './DestroyOrderSubmitResult.tsx';

function DestroyServiceStatusAlert({
    deployedService,
    destroySubmitRequest,
    getDestroyServiceOrderStatusQuery,
    closeDestroyResultAlert,
    serviceProviderContactDetails,
}: {
    deployedService: DeployedService;
    destroySubmitRequest: UseMutationResult<ServiceOrder | undefined, Error, string>;
    getDestroyServiceOrderStatusQuery: UseQueryResult<ServiceOrderStatusUpdate | undefined>;
    closeDestroyResultAlert: (arg: boolean) => void;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const stopWatch = useStopwatch({
        autoStart: true,
    });

    const onClose = () => {
        closeDestroyResultAlert(true);
    };

    const msg = (() => {
        if (destroySubmitRequest.isPending) {
            return 'Request submission in-progress';
        } else if (destroySubmitRequest.isError) {
            if (isHandleKnownErrorResponse(destroySubmitRequest.error)) {
                const response: ErrorResponse = destroySubmitRequest.error.body;
                return getOrderSubmissionFailedDisplay(response.errorType, response.details);
            } else {
                return getOrderSubmissionFailedDisplay(destroySubmitRequest.error.name, [
                    destroySubmitRequest.error.message,
                ]);
            }
        } else if (destroySubmitRequest.isSuccess) {
            if (
                getDestroyServiceOrderStatusQuery.isSuccess &&
                (getDestroyServiceOrderStatusQuery.data?.orderStatus === OrderStatus.SUCCESSFUL ||
                    getDestroyServiceOrderStatusQuery.data?.orderStatus === OrderStatus.FAILED)
            ) {
                return (
                    <OrderProcessingStatus
                        operationType={OperationType.Destroy}
                        serviceOrderStatus={getDestroyServiceOrderStatusQuery.data}
                        serviceId={deployedService.serviceId}
                        selectedServiceHostingType={deployedService.serviceHostingType}
                    />
                );
            } else if (getDestroyServiceOrderStatusQuery.isError) {
                if (deployedService.serviceHostingType === ServiceHostingType.SERVICE_VENDOR) {
                    return 'Destroy status polling failed. Please visit MyServices page to check the status of the request and contact service vendor for error details.';
                } else {
                    return 'Destroy status polling failed. Please visit MyServices page to check the status of the request';
                }
            } else if (
                getDestroyServiceOrderStatusQuery.isPending ||
                getDestroyServiceOrderStatusQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'Destroying, Please wait...';
            }
        }
    })();

    const alertType = useMemo(() => {
        if (destroySubmitRequest.isPending) {
            return 'success';
        } else if (destroySubmitRequest.isError || getDestroyServiceOrderStatusQuery.isError) {
            if (stopWatch.isRunning) {
                stopWatch.pause();
            }
            return 'error';
        } else if (destroySubmitRequest.isSuccess) {
            if (
                getDestroyServiceOrderStatusQuery.isSuccess &&
                getDestroyServiceOrderStatusQuery.data?.orderStatus === OrderStatus.FAILED
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'error';
            } else if (
                getDestroyServiceOrderStatusQuery.isSuccess &&
                getDestroyServiceOrderStatusQuery.data?.orderStatus === OrderStatus.SUCCESSFUL
            ) {
                if (stopWatch.isRunning) {
                    stopWatch.pause();
                }
                return 'success';
            } else if (
                getDestroyServiceOrderStatusQuery.isPending ||
                getDestroyServiceOrderStatusQuery.data?.orderStatus === OrderStatus.IN_PROGRESS
            ) {
                return 'success';
            }
        }
        return 'success';
    }, [stopWatch, destroySubmitRequest, getDestroyServiceOrderStatusQuery]);

    function getOrderSubmissionFailedDisplay(errorType: string, reasons: string[]) {
        return (
            <div>
                <span>{errorType.length > 0 ? errorType : 'Service destroy request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    const getOrderId = (): string => {
        if (destroySubmitRequest.isSuccess && destroySubmitRequest.data) {
            return destroySubmitRequest.data.orderId;
        } else {
            if (
                isHandleKnownErrorResponse(destroySubmitRequest.error) &&
                'orderId' in destroySubmitRequest.error.body
            ) {
                return destroySubmitRequest.error.body.orderId as string;
            }
            return '-';
        }
    };

    return (
        <DestroyOrderSubmitResult
            msg={msg ?? ''}
            serviceId={deployedService.serviceId}
            orderId={getOrderId()}
            type={alertType}
            onClose={onClose}
            stopWatch={stopWatch}
            contactServiceDetails={alertType !== 'success' ? serviceProviderContactDetails : undefined}
        />
    );
}

export default DestroyServiceStatusAlert;
